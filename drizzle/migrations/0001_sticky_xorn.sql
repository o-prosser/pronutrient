CREATE TABLE "records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barcode" varchar(70) NOT NULL,
	"name" varchar(255) NOT NULL,
	"imageUrl" varchar(255),
	"servingSize" integer NOT NULL,
	"servings" integer NOT NULL,
	"carbohydrates" integer,
	"energy" integer,
	"fat" integer,
	"fiber" integer,
	"protein" integer,
	"salt" integer,
	"sugars" integer,
	"saturatedFat" integer,
	"userId" uuid NOT NULL,
	"date" date NOT NULL,
	"meal" varchar(20) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "records_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;