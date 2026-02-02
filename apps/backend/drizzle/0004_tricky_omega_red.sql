ALTER TABLE "sellers" ALTER COLUMN "fixed_commission" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "percentage_commission" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "applied_seller_fixed" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "applied_seller_percent" numeric(5, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "applied_manager_fixed" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "applied_manager_percent" numeric(5, 2) NOT NULL;