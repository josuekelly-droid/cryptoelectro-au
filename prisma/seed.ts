import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cryptoelectro.au" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@cryptoelectro.au",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Test customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });
  console.log(`✅ Customer user created: ${customer.email}`);

  // Categories
  const categories = [
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest flagship phones from top brands",
      image: "/images/categories/smartphones.webp",
    },
    {
      name: "Cameras",
      slug: "cameras",
      description: "Professional cameras and accessories",
      image: "/images/categories/cameras.webp",
    },
    {
      name: "Home Appliances",
      slug: "home-appliances",
      description: "Premium home and kitchen appliances",
      image: "/images/categories/home-appliances.webp",
    },
    {
      name: "Computers",
      slug: "computers",
      description: "Laptops, desktops, and accessories",
      image: "/images/categories/computers.webp",
    },
    {
      name: "Gaming Consoles",
      slug: "gaming-consoles",
      description: "Consoles, games, and gaming gear",
      image: "/images/categories/gaming-consoles.webp",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Brands
  const brands = [
    { name: "Samsung", slug: "samsung", description: "Leading electronics manufacturer" },
    { name: "Apple", slug: "apple", description: "Premium technology company" },
    { name: "Sony", slug: "sony", description: "Innovative electronics and entertainment" },
    { name: "LG", slug: "lg", description: "Home appliances and electronics" },
    { name: "Dell", slug: "dell", description: "Computer technology solutions" },
    { name: "Nikon", slug: "nikon", description: "Precision optics and imaging" },
    { name: "Dyson", slug: "dyson", description: "Innovative home technology" },
    { name: "Microsoft", slug: "microsoft", description: "Software and hardware technology" },
    { name: "Nintendo", slug: "nintendo", description: "Gaming and entertainment" },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log(`✅ ${brands.length} brands created`);

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Login credentials:");
  console.log("   Admin: admin@cryptoelectro.au / admin123");
  console.log("   Customer: john@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });