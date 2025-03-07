import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Invalid file" });

export const damageReportFormSchema = z.object({
  vin_number: z.string(),
  rider_name: z.string(),
  rider_number: z.string(),
  vendor: z.string(),
  type: z.enum(["return", "recover"]),
  damageParts: z.string(),
  totalDamageCost: z.string(),
  paymentStatus: z.enum(["paid", "unpaid"]),
  clustorPhotos: z.array(fileSchema).min(1, "Upload at least one photo."),
  damageVideo: fileSchema,
});

export type DamageReportFormSchema = z.infer<typeof damageReportFormSchema>;
