import { PrismaClient, Role, HotelCategory, BookingStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando proceso de seed en la base de datos de Contigo Tours...");

  // Limpiar datos existentes (en orden inverso de relaciones)
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Base de datos limpia.");

  // 1. Crear Usuarios de prueba
  const hashFn = (bcrypt as any).hash || (bcrypt as any).default?.hash || ((pass: string) => bcrypt.hashSync(pass, 10));
  const hashedPasswordAdmin = await hashFn("Admin12345!", 10);
  const hashedPasswordClient = await hashFn("Cliente12345!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@contigotours.com",
      password: hashedPasswordAdmin,
      name: "Administrador Contigo Tours",
      phone: "+52 998 123 4567",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const client = await prisma.user.create({
    data: {
      email: "cliente@contigotours.com",
      password: hashedPasswordClient,
      name: "Carlos Mendoza",
      phone: "+57 300 987 6543",
      role: Role.CLIENT,
      emailVerified: new Date(),
    },
  });

  console.log("👤 Usuarios de prueba creados:", {
    admin: admin.email,
    client: client.email,
  });

  // 2. Crear Destinos con coordenadas geográficas reales para el mapa interactivo Leaflet
  const destinationsData = [
    {
      name: "Cancún y Riviera Maya",
      slug: "cancun-riviera-maya",
      description: "Playas de arena blanca, aguas turquesas del Caribe, cenotes sagrados y una vibrante vida nocturna.",
      country: "México",
      city: "Cancún",
      latitude: 21.1619,
      longitude: -86.8515,
      basePrice: 480.0,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 4.9,
      hotels: [
        {
          name: "Grand Riviera All-Inclusive Resort",
          description: "Resort 5 estrellas frente al mar Caribe con 7 restaurantes temáticos y parque acuático.",
          address: "Blvd. Kukulcan Km 16.5, Zona Hotelera, Cancún",
          category: HotelCategory.ALL_INCLUSIVE,
          pricePerNight: 220.0,
          rating: 4.9,
          imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
          amenities: "Piscina infinita,Spa de lujo,Playa privada,7 Restaurantes,Gimnasio",
        },
        {
          name: "Caribe Sol Beachfront Suites",
          description: "Suites privadas con balcón panorámico y acceso directo a la playa de Cancún.",
          address: "Zona Hotelera Km 9, Cancún",
          category: HotelCategory.BEACHFRONT,
          pricePerNight: 165.0,
          rating: 4.7,
          imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
          amenities: "Vista al mar,Piscina,Restaurante,Wifi alta velocidad",
        },
        {
          name: "Hostal & Eco-Lodge Maya Sunset",
          description: "Alojamiento cómodo, ecológico y económico en el centro de la ciudad con transporte a playas.",
          address: "Av. Tulum 45, Centro, Cancún",
          category: HotelCategory.BUDGET,
          pricePerNight: 45.0,
          rating: 4.5,
          imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
          amenities: "Cocina compartida,Wifi,Piscina pequeña,Desayuno incluido",
        },
      ],
    },
    {
      name: "Ciudad de México (CDMX)",
      slug: "ciudad-de-mexico-cdmx",
      description: "Una metrópoli cosmopolita rica en historia prehispánica, museos de talla mundial y gastronomía galardonada.",
      country: "México",
      city: "CDMX",
      latitude: 19.4326,
      longitude: -99.1332,
      basePrice: 350.0,
      imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 4.8,
      hotels: [
        {
          name: "Boutique Hotel Casa Colonial Roma",
          description: "Mansión de época porfiriana remodelada en el corazón de la colonia Roma Norte.",
          address: "Colima 120, Col. Roma Norte, Cuauhtémoc, CDMX",
          category: HotelCategory.BOUTIQUE,
          pricePerNight: 140.0,
          rating: 4.9,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          amenities: "Terraza rooftop,Café de especialidad,Bicicletas gratuitas,Pet-friendly",
        },
        {
          name: "Condesa Paws & Sleep Pet-Friendly",
          description: "Tu mejor amigo de cuatro patas es bienvenido con amenidades caninas y acceso a parques.",
          address: "Av. Amsterdam 78, Condesa, CDMX",
          category: HotelCategory.PET_FRIENDLY,
          pricePerNight: 110.0,
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
          amenities: "Camas para mascotas,Wifi,Desayuno continental,Jardín interno",
        },
      ],
    },
    {
      name: "Oaxaca de Juárez",
      slug: "oaxaca-de-juarez",
      description: "Tierra de mezcal, mole tradicional, arquitectura virreinal y la mágica zona arqueológica de Monte Albán.",
      country: "México",
      city: "Oaxaca",
      latitude: 17.0732,
      longitude: -96.7266,
      basePrice: 290.0,
      imageUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 4.9,
      hotels: [
        {
          name: "Quinta Real Santo Domingo Boutique",
          description: "Elegante convento del siglo XVI con patios de cantera verde y gastronomía oaxaqueña.",
          address: "5 de Mayo 300, Centro Histórico, Oaxaca",
          category: HotelCategory.BOUTIQUE,
          pricePerNight: 185.0,
          rating: 4.9,
          imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          amenities: "Piscina en claustro,Restaurante gourmet,Cata de mezcal,Spa",
        },
        {
          name: "Posada El Jaguar Oaxaqueño",
          description: "Hospedaje cálido y accesible a pocas cuadras del Templo de Santo Domingo y el mercado 20 de Noviembre.",
          address: "Calle Macedonio Alcalá 402, Oaxaca",
          category: HotelCategory.BUDGET,
          pricePerNight: 55.0,
          rating: 4.6,
          imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
          amenities: "Desayuno tradicional,Patio central,Wifi,Guía turístico local",
        },
      ],
    },
    {
      name: "Bogotá Histórica y Cultural",
      slug: "bogota-historica",
      description: "Descubre la capital de los Andes con su barrio colonial de La Candelaria, el cerro de Monserrate y el Museo del Oro.",
      country: "Colombia",
      city: "Bogotá",
      latitude: 4.711,
      longitude: -74.0721,
      basePrice: 320.0,
      imageUrl: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      rating: 4.7,
      hotels: [
        {
          name: "Hotel de la Ópera Candelaria Boutique",
          description: "Elegancia colonial republicana junto al Teatro Colón y a pasos de la Plaza de Bolívar.",
          address: "Calle 10 No. 5-72, La Candelaria, Bogotá",
          category: HotelCategory.BOUTIQUE,
          pricePerNight: 125.0,
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
          amenities: "Spa termal,Restaurante mirador,Cava de vinos,Wifi",
        },
      ],
    },
    {
      name: "Medellín: La Ciudad de la Eterna Primavera",
      slug: "medellin-eterna-primavera",
      description: "Clima perfecto todo el año, innovación urbana con Metrocable, Comuna 13 y el vibrante sector del Poblado.",
      country: "Colombia",
      city: "Medellín",
      latitude: 6.2442,
      longitude: -75.5812,
      basePrice: 340.0,
      imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 4.9,
      hotels: [
        {
          name: "The Click Clack Hotel El Poblado",
          description: "Diseño vanguardista, rooftop bar con vistas a las montañas y epicentro gastronómico.",
          address: "Calle 10B No. 37-42, El Poblado, Medellín",
          category: HotelCategory.BOUTIQUE,
          pricePerNight: 150.0,
          rating: 4.9,
          imageUrl: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80",
          amenities: "Rooftop bar,Restaurante de autor,Piscina exterior,Pet-friendly",
        },
        {
          name: "Green Garden Pet-Friendly Suites",
          description: "Amplias suites con jardines y terraza ideales para viajar en familia con mascotas.",
          address: "Cra 43A #14-25, Medellín",
          category: HotelCategory.PET_FRIENDLY,
          pricePerNight: 95.0,
          rating: 4.7,
          imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
          amenities: "Jardín privado,Desayuno buffet,Gimnasio,Wifi",
        },
      ],
    },
    {
      name: "Cartagena de Indias",
      slug: "cartagena-de-indias",
      description: "Murallas coloniales centenarias, balcones llenos de buganvilias, atardeceres mágicos en el mar Caribe y gastronomía costeña.",
      country: "Colombia",
      city: "Cartagena",
      latitude: 10.391,
      longitude: -75.4794,
      basePrice: 420.0,
      imageUrl: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 4.9,
      hotels: [
        {
          name: "Bastión Luxury Beach & Colonial",
          description: "Palacete del siglo XVI en la Ciudad Amurallada con terraza mirador hacia el mar.",
          address: "Calle del Sargento Mayor No. 6-87, Centro, Cartagena",
          category: HotelCategory.BEACHFRONT,
          pricePerNight: 210.0,
          rating: 4.9,
          imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
          amenities: "Piscina en terraza,Bar caribeño,Spa de coco,Playa cercana",
        },
        {
          name: "Caribe Sol All-Inclusive Bocagrande",
          description: "Hotel resort con sistema todo incluido frente a las playas de Bocagrande.",
          address: "Cra 1 No. 8-12, Bocagrande, Cartagena",
          category: HotelCategory.ALL_INCLUSIVE,
          pricePerNight: 175.0,
          rating: 4.7,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          amenities: "Todo incluido,Shows nocturnos,3 Piscinas,Club infantil",
        },
      ],
    },
    {
      name: "Cusco y Machu Picchu",
      slug: "cusco-machu-picchu",
      description: "La capital sagrada del Imperio Inca y una de las maravillas del mundo moderno en el Valle Sagrado.",
      country: "Perú",
      city: "Cusco",
      latitude: -13.5319,
      longitude: -71.9675,
      basePrice: 510.0,
      imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      rating: 5.0,
      hotels: [
        {
          name: "Palacio del Inka Luxury Collection",
          description: "Mansión histórica de cinco siglos frente al Templo del Sol Koricancha.",
          address: "Plaza Santo Domingo 259, Cusco",
          category: HotelCategory.BOUTIQUE,
          pricePerNight: 230.0,
          rating: 5.0,
          imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
          amenities: "Habitaciones oxigenadas,Spa andino,Patio virreinal,Restaurante Inti Raymi",
        },
      ],
    },
    {
      name: "Punta Cana",
      slug: "punta-cana",
      description: "Kilómetros de cocoteros, arenas finas y complejos turísticos all-inclusive de ensueño en el Caribe.",
      country: "República Dominicana",
      city: "Punta Cana",
      latitude: 18.5601,
      longitude: -68.3725,
      basePrice: 495.0,
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      rating: 4.8,
      hotels: [
        {
          name: "Palms Royal All-Inclusive & Spa",
          description: "Megacomplejo caribeño con acceso privado a Playa Bávaro y golf internacional.",
          address: "Playa Bávaro Km 3, Punta Cana",
          category: HotelCategory.ALL_INCLUSIVE,
          pricePerNight: 240.0,
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
          amenities: "Todo incluido ilimitado,Casino,Campo de golf,Parque acuático",
        },
      ],
    },
  ];

  let sampleBookingHotelId: string | null = null;
  let sampleBookingDestinationId: string | null = null;

  for (const d of destinationsData) {
    const { hotels, ...destInfo } = d;
    const createdDest = await prisma.destination.create({
      data: destInfo,
    });

    if (!sampleBookingDestinationId) {
      sampleBookingDestinationId = createdDest.id;
    }

    for (const h of hotels) {
      const createdHotel = await prisma.hotel.create({
        data: {
          ...h,
          destinationId: createdDest.id,
        },
      });

      if (!sampleBookingHotelId && createdDest.id === sampleBookingDestinationId) {
        sampleBookingHotelId = createdHotel.id;
      }
    }
  }

  console.log(`🗺️  ${destinationsData.length} destinos y sus hoteles creados exitosamente.`);

  // 3. Crear Reservas de Ejemplo para el Cliente de prueba
  if (sampleBookingDestinationId && sampleBookingHotelId) {
    const booking1 = await prisma.booking.create({
      data: {
        bookingCode: "CT-2025-CAN01",
        userId: client.id,
        destinationId: sampleBookingDestinationId,
        hotelId: sampleBookingHotelId,
        checkIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // En 15 días
        checkOut: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 5 noches
        adults: 2,
        children: 1,
        preferences: JSON.stringify({
          category: "ALL_INCLUSIVE",
          specialRequests: "Habitación con cama king y cuna adicional para infante.",
        }),
        totalPrice: 2060.0,
        status: BookingStatus.PAID,
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        stripePaymentIntentId: "pi_test_seed_1234567890",
        stripeSessionId: "cs_test_seed_abcdef123456",
        amount: 2060.0,
        currency: "USD",
        status: PaymentStatus.COMPLETED,
        paymentMethod: "STRIPE",
      },
    });

    // Reserva pendiente
    await prisma.booking.create({
      data: {
        bookingCode: "CT-2025-MED02",
        userId: client.id,
        destinationId: sampleBookingDestinationId,
        hotelId: sampleBookingHotelId,
        checkIn: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000),
        adults: 1,
        children: 0,
        preferences: JSON.stringify({
          category: "BOUTIQUE",
          specialRequests: "Piso alto, vista panorámica.",
        }),
        totalPrice: 940.0,
        status: BookingStatus.PENDING,
      },
    });

    console.log("🎟️  Reservas y pagos de prueba creados para el cliente.");
  }

  console.log("✅ Seed finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
