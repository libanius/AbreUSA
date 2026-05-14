import { getSupabaseServerClient } from "@/lib/supabase-server";
import type {
  DocumentFiles,
  PersistOrderPayload,
  PersistOrderResult,
} from "@/lib/order-persistence-types";

async function uploadAndRecordDocument(
  orderId: string,
  kind: "passport" | "us_address_proof",
  file: File,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `${orderId}/${kind}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const { error: recordError } = await supabase.from("documents").insert({
    order_id: orderId,
    document_type: kind,
    file_name: file.name,
    mime_type: file.type,
    storage_path: storagePath,
    retention_category: "sensitive_upload",
    retention_status: "active",
    deletion_status: "not_applicable",
  });
  if (recordError) throw recordError;
}

export async function persistOrderServer(
  payload: PersistOrderPayload,
  files?: DocumentFiles,
): Promise<PersistOrderResult> {
  const supabase = getSupabaseServerClient();
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      service_type: payload.order.serviceType,
      status: payload.order.status,
      approved_at: payload.order.approvedAt,
    })
    .select("id, protocol_number")
    .single();

  if (orderError) throw orderError;
  const orderId = orderRow.id as string;
  const protocolNumber = orderRow.protocol_number as string;

  const { error: applicantError } = await supabase.from("applicants").insert({
    order_id: orderId,
    name: payload.applicant.name,
    email: payload.applicant.email,
    phone: payload.applicant.phone,
    residential_street: payload.applicant.residentialStreet || null,
    residential_city: payload.applicant.residentialCity || null,
    residential_state: payload.applicant.residentialState || null,
    residential_zip: payload.applicant.residentialZip || null,
  });
  if (applicantError) throw applicantError;

  const { error: llcError } = await supabase.from("llcs").insert({
    order_id: orderId,
    legal_name: payload.llc.legalName,
    state: payload.llc.state,
    business_activity_label: payload.llc.businessActivityLabel,
    principal_street: payload.llc.principalStreet,
    principal_city: payload.llc.principalCity,
    principal_state: payload.llc.principalState,
    principal_zip: payload.llc.principalZip,
    principal_same_as_applicant_address:
      payload.llc.principalSameAsApplicantAddress ?? false,
    management_type: payload.llc.managementType,
    member_count: payload.llc.memberCount,
  });
  if (llcError) throw llcError;

  const memberRows = payload.members.map((member, index) => ({
    order_id: orderId,
    member_index: index,
    full_name: member.fullName,
    address: member.address,
    ownership_percentage: parseFloat(member.ownershipPercentage),
  }));
  const { error: membersError } = await supabase.from("members").insert(memberRows);
  if (membersError) throw membersError;

  const { error: raError } = await supabase.from("registered_agents").insert({
    order_id: orderId,
    choice: payload.registeredAgent.choice,
    name: payload.registeredAgent.name || null,
    address: payload.registeredAgent.address || null,
    city: payload.registeredAgent.city || null,
    state: payload.registeredAgent.state || null,
    zip: payload.registeredAgent.zip || null,
  });
  if (raError) throw raError;

  if (payload.einDetails) {
    const { error: einError } = await supabase.from("ein_details").insert({
      order_id: orderId,
      reason_for_applying: payload.einDetails.reasonForApplying,
      entity_type: payload.einDetails.entityType,
      responsible_party_name: payload.einDetails.responsiblePartyName,
      responsible_party_passport_number:
        payload.einDetails.responsiblePartyPassportNumber,
      start_date: payload.einDetails.startDate,
      fiscal_closing_month: payload.einDetails.fiscalClosingMonth,
    });
    if (einError) throw einError;
  }

  const formRows = payload.generatedForms.map((form) => ({
    order_id: orderId,
    form_type: form.formType,
    customer_approved: form.customerApproved,
  }));
  const { error: formsError } = await supabase
    .from("generated_forms")
    .insert(formRows);
  if (formsError) throw formsError;

  if (files?.passport) {
    await uploadAndRecordDocument(orderId, "passport", files.passport);
  }
  if (files?.addressProof) {
    await uploadAndRecordDocument(orderId, "us_address_proof", files.addressProof);
  }

  return { orderId, protocolNumber };
}
