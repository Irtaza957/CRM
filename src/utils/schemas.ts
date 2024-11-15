import { z } from "zod";

export const addressSchema = z.object({
  address_type: z.string().min(1, "Address Type is required"),
  building_no: z.string().min(1, "Building Number is required"),
  apartment: z.string().min(1, "Apartment Number is required"),
  street: z.string().min(1, "Street is required"),
  map_link: z.string().min(1, "Map Link is required"),
  extra_direction: z.string().min(1, "Extra Direction is required"),
});

export const customerSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(7, {message: 'Phone must contain at least 7 characters'}),
  email: z.string().email().optional(),
  is_allergy: z.string().default("no"),
  allergy_description: z.string().max(500).optional(),
  is_medication: z.string().default("no"),
  medication_description: z.string().max(500).optional(),
  is_medical_condition: z.string().default("no"),
  medical_condition_description: z.string().max(500).optional(),
  customer_source_id: z.string().min(1, { message: "Source is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
}).superRefine((data, ctx) => {
    if (data.is_allergy === "yes" && !data.allergy_description) {
      ctx.addIssue({
        path: ["allergy_description"],
        message: "Allergy description is required.",
        code: 'custom'
      });
    }

    if (data.is_medication === "yes" && !data.medication_description) {
      ctx.addIssue({
        path: ["medication_description"],
        message: "Medication description is required.",
        code: 'custom'
      });
    }

    if (data.is_medical_condition === "yes" && !data.medical_condition_description) {
      ctx.addIssue({
        path: ["medical_condition_description"],
        message: "Medical condition description is required.",
        code: 'custom'
      });
    }
  });

export const medicalDetailSchema = z.object({
  is_allergy: z.string().default("no"),
  allergy_description: z.string().max(500).optional(),
  is_medication: z.string().default("no"),
  medication_description: z.string().max(500).optional(),
  is_medical_condition: z.string().default("no"),
  medical_condition_description: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
    if (data.is_allergy === "yes" && !data.allergy_description) {
      ctx.addIssue({
        path: ["allergy_description"],
        message: "Allergy description is required.",
        code: 'custom'
      });
    }

    if (data.is_medication === "yes" && !data.medication_description) {
      ctx.addIssue({
        path: ["medication_description"],
        message: "Medication description is required.",
        code: 'custom'
      });
    }

    if (data.is_medical_condition === "yes" && !data.medical_condition_description) {
      ctx.addIssue({
        path: ["medical_condition_description"],
        message: "Medical condition description is required.",
        code: 'custom'
      });
    }
  });


export const familyMemberSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    allergies: z.string().default("no"),
    allergiesDesc: z.string().max(500).optional(),
    medications: z.string().default("no"),
    medicationsDesc: z.string().max(500).optional(),
    medicalConditions: z.string().default("no"),
    medicalConditionDesc: z.string().max(500).optional(),

    relation: z.string().min(1, { message: "Relation is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.allergies === "yes" && !data.allergiesDesc) {
      ctx.addIssue({
        path: ["allergiesDesc"],
        message: "Allergy description is required.",
        code: 'custom'
      });
    } else if (data.allergies === "no") {
      ctx.addIssue({
        path: ["allergiesDesc"],
        message: "",
        code: 'custom'
      });
    }

    if (data.medications === "yes" && !data.medicationsDesc) {
      ctx.addIssue({
        path: ["medicationsDesc"],
        message: "Medication description is required.",
        code: 'custom'
      });
    }

    if (data.medicalConditions === "yes" && !data.medicalConditionDesc) {
      ctx.addIssue({
        path: ["medicalConditionDesc"],
        message: "Medical condition description is required.",
        code: 'custom'
      });
    }
  });
