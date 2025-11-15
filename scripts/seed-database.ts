import { createClient } from '@supabase/supabase-js';
import { mockRestaurants, mockReviews } from '../src/lib/mock-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    console.log('Creating test user profile...');
    const testUserId = '00000000-0000-0000-0000-000000000001';

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        name: 'Admin User',
        email: 'admin@tablein.uz',
        role: 'owner'
      });

    if (profileError) {
      console.log('Profile already exists or error:', profileError.message);
    }

    console.log('Seeding restaurants...');
    for (const restaurant of mockRestaurants) {
      const restaurantData = {
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description,
        address: restaurant.address,
        city: restaurant.city,
        country: restaurant.country,
        cuisine: restaurant.cuisine,
        features: restaurant.features,
        price_range: restaurant.priceRange,
        rating: restaurant.rating,
        review_count: restaurant.reviewCount,
        opening_hours: restaurant.openingHours,
        images: restaurant.images,
        owner_id: testUserId,
        is_newly_joined: restaurant.isNewlyJoined || false,
        is_michelin_guide: restaurant.isMichelinGuide || false,
      };

      const { data: restaurantResult, error: restaurantError } = await supabase
        .from('restaurants')
        .upsert(restaurantData, { onConflict: 'slug' })
        .select()
        .single();

      if (restaurantError) {
        console.error(`Error seeding restaurant ${restaurant.name}:`, restaurantError);
        continue;
      }

      console.log(`✓ Seeded restaurant: ${restaurant.name}`);

      if (restaurant.layout) {
        const { error: layoutError } = await supabase
          .from('restaurant_layouts')
          .upsert({
            restaurant_id: restaurantResult.id,
            name: restaurant.layout.name,
            width: restaurant.layout.width,
            height: restaurant.layout.height,
            tables: restaurant.layout.tables,
            obstacles: restaurant.layout.obstacles,
          }, { onConflict: 'restaurant_id' });

        if (layoutError) {
          console.error(`Error seeding layout for ${restaurant.name}:`, layoutError);
        } else {
          console.log(`  ✓ Seeded layout`);
        }
      }

      if (restaurant.menu && restaurant.menu.length > 0) {
        const menuItems = restaurant.menu.map(item => ({
          restaurant_id: restaurantResult.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          features: item.features || [],
          preparation_time: item.preparationTime,
          is_available: true,
        }));

        const { error: menuError } = await supabase
          .from('menu_items')
          .upsert(menuItems, { onConflict: 'id', ignoreDuplicates: true });

        if (menuError) {
          console.error(`Error seeding menu for ${restaurant.name}:`, menuError);
        } else {
          console.log(`  ✓ Seeded ${menuItems.length} menu items`);
        }
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Browse restaurants at /restaurants');
    console.log('2. View restaurant details with layouts and menus');
    console.log('3. Sign in as admin@tablein.uz to manage restaurants');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
