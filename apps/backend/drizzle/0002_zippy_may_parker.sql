ALTER TABLE "sellers" ALTER COLUMN "fixed_commission" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "percentage_commission" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "updated_at" timestamp DEFAULT now();