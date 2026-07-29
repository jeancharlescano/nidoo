import { PrismaClient } from "../src/generated/prisma/client";
import { DiaperType, FeedingType, FamilyRole } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	const family = await prisma.family.create({
		data: {
			name: "Famille Martin",
		},
	});

	const papa = await prisma.user.create({
		data: {
			email: "papa@test.fr",
			password: "password",
			firstName: "Thomas",
			lastName: "Martin",
		},
	});

	const maman = await prisma.user.create({
		data: {
			email: "maman@test.fr",
			password: "password",
			firstName: "Julie",
			lastName: "Martin",
		},
	});

	await prisma.familyMember.createMany({
		data: [
			{
				familyId: family.id,
				userId: papa.id,
				role: FamilyRole.ADMIN,
			},
			{
				familyId: family.id,
				userId: maman.id,
				role: FamilyRole.PARENT,
			},
		],
	});

	const baby = await prisma.baby.create({
		data: {
			familyId: family.id,
			firstName: "Léo",
			birthDate: new Date("2026-07-10"),
		},
	});

	const today = new Date();

	const at = (hour: number, minute: number) => {
		const d = new Date(today);
		d.setHours(hour, minute, 0, 0);
		return d;
	};

	// Repas
	await prisma.feeding.createMany({
		data: [
			{
				babyId: baby.id,
				createdBy: maman.id,
				type: FeedingType.BOTTLE,
				quantityMl: 90,
				occurredAt: at(7, 15),
			},
			{
				babyId: baby.id,
				createdBy: papa.id,
				type: FeedingType.BREAST,
				occurredAt: at(10, 20),
			},
			{
				babyId: baby.id,
				createdBy: maman.id,
				type: FeedingType.BOTTLE,
				quantityMl: 120,
				occurredAt: at(13, 0),
			},
		],
	});

	// Sommeil
	await prisma.sleepSession.createMany({
		data: [
			{
				babyId: baby.id,
				createdBy: maman.id,
				startAt: at(8, 0),
				endAt: at(9, 30),
			},
			{
				babyId: baby.id,
				createdBy: papa.id,
				startAt: at(14, 0),
				endAt: at(15, 15),
			},
		],
	});

	// Couches
	await prisma.diaperChange.createMany({
		data: [
			{
				babyId: baby.id,
				createdBy: maman.id,
				type: DiaperType.PEE,
				occurredAt: at(8, 45),
			},
			{
				babyId: baby.id,
				createdBy: papa.id,
				type: DiaperType.BOTH,
				occurredAt: at(11, 5),
			},
			{
				babyId: baby.id,
				createdBy: maman.id,
				type: DiaperType.POOP,
				occurredAt: at(15, 30),
			},
		],
	});

	console.log("✅ Seed terminé !");
}

main()
	.catch(console.error)
	.finally(async () => {
		await prisma.$disconnect();
	});
