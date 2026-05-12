import { Cuisine, DayMealPlan, DietType, Goal, Meal, MealItem } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function meal(
  id: string,
  name: string,
  time: string,
  emoji: string,
  items: MealItem[]
): Meal {
  return {
    id,
    name,
    time,
    emoji,
    items,
    totalCalories: items.reduce((s, i) => s + i.calories, 0),
    totalProtein: items.reduce((s, i) => s + i.protein, 0),
    totalCarbs: items.reduce((s, i) => s + i.carbs, 0),
    totalFat: items.reduce((s, i) => s + i.fat, 0),
  };
}

function item(
  name: string,
  quantity: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): MealItem {
  return { name, quantity, calories, protein, carbs, fat };
}

/** Scale a meal plan so total calories match the user's daily target. */
function scalePlan(plan: DayMealPlan, targetCalories: number): DayMealPlan {
  const ratio = targetCalories / plan.totalCalories;
  const scaled = plan.meals.map((m) => {
    const scaledItems = m.items.map((i) => ({
      ...i,
      calories: Math.round(i.calories * ratio),
      protein: Math.round(i.protein * ratio),
      carbs: Math.round(i.carbs * ratio),
      fat: Math.round(i.fat * ratio),
    }));
    return {
      ...m,
      items: scaledItems,
      totalCalories: scaledItems.reduce((s, i) => s + i.calories, 0),
      totalProtein: scaledItems.reduce((s, i) => s + i.protein, 0),
      totalCarbs: scaledItems.reduce((s, i) => s + i.carbs, 0),
      totalFat: scaledItems.reduce((s, i) => s + i.fat, 0),
    };
  });
  return {
    ...plan,
    meals: scaled,
    totalCalories: scaled.reduce((s, m) => s + m.totalCalories, 0),
  };
}

// ---------------------------------------------------------------------------
// INDIAN meal templates  (~2000 kcal base)
// ---------------------------------------------------------------------------

const indian_cut_any: DayMealPlan = {
  cuisineLabel: 'Indian',
  totalCalories: 2000,
  tip: 'Use dal + sabzi combos for protein without excess fat. Swap cream-based curries for tomato-based ones.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Moong dal chilla', '3 pieces', 270, 18, 30, 5),
      item('Mint-coriander chutney', '2 tbsp', 20, 1, 3, 0),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥜', [
      item('Roasted chana', '40g', 140, 8, 20, 3),
      item('Spiced buttermilk (chaas)', '250ml', 60, 3, 6, 2),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Moong dal (cooked)', '1 cup', 220, 15, 35, 1),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Palak sabzi', '1 cup', 80, 4, 8, 3),
      item('Cucumber-tomato raita', '100g', 60, 3, 6, 2),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('Roasted makhana', '25g', 100, 3, 19, 1),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍗', [
      item('Chicken tikka (grilled)', '200g', 260, 40, 2, 9),
      item('Multigrain roti', '1 piece', 80, 3, 15, 1),
      item('Mixed vegetable sabzi', '1 cup', 90, 3, 12, 3),
      item('Salad (onion, lemon)', '1 bowl', 25, 1, 5, 0),
    ]),
  ],
};

const indian_cut_veg: DayMealPlan = {
  ...indian_cut_any,
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Besan chilla', '3 pieces', 280, 14, 32, 6),
      item('Mint-coriander chutney', '2 tbsp', 20, 1, 3, 0),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥛', [
      item('Roasted chana', '40g', 140, 8, 20, 3),
      item('Low-fat dahi', '150g', 65, 5, 6, 2),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Rajma (kidney beans)', '¾ cup', 190, 12, 32, 1),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Bhindi sabzi', '1 cup', 75, 3, 9, 3),
      item('Cucumber raita', '100g', 60, 3, 6, 2),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('5 almonds', '5 pieces', 60, 2, 2, 5),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🧀', [
      item('Paneer tikka (grilled)', '150g', 270, 22, 5, 18),
      item('Multigrain roti', '1 piece', 80, 3, 15, 1),
      item('Palak sabzi', '1 cup', 80, 4, 8, 3),
      item('Green salad', '1 bowl', 30, 1, 6, 0),
    ]),
  ],
};

const indian_cut_vegan: DayMealPlan = {
  ...indian_cut_any,
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🫘', [
      item('Moong dal chilla', '3 pieces', 270, 18, 30, 5),
      item('Tomato-coriander chutney', '2 tbsp', 20, 0, 4, 0),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥜', [
      item('Roasted chana', '40g', 140, 8, 20, 3),
      item('Coconut water', '250ml', 60, 1, 14, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Chana masala', '¾ cup', 210, 11, 35, 4),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Aloo-methi sabzi', '1 cup', 100, 3, 15, 3),
      item('Green salad', '1 bowl', 30, 1, 6, 0),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍊', [
      item('Orange', '1 medium', 70, 1, 16, 0),
      item('Pumpkin seeds', '20g', 110, 5, 3, 9),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🫘', [
      item('Tofu tikka (grilled)', '200g', 200, 22, 6, 10),
      item('Multigrain roti', '1 piece', 80, 3, 15, 1),
      item('Mixed dal', '½ cup', 110, 7, 17, 1),
      item('Kachumber salad', '1 bowl', 40, 2, 7, 1),
    ]),
  ],
};

const indian_bulk_any: DayMealPlan = {
  cuisineLabel: 'Indian',
  totalCalories: 3200,
  tip: 'Add ghee to rotis and full-fat dahi to every meal. Post-workout rice + dal is your best friend for recovery.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🫓', [
      item('Aloo paratha', '2 pieces', 500, 10, 78, 16),
      item('Full-fat dahi', '200g', 130, 8, 10, 6),
      item('Whole milk', '300ml', 200, 10, 15, 11),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🍌', [
      item('Banana', '2 large', 200, 2, 52, 0),
      item('Peanut butter', '2 tbsp', 180, 8, 6, 16),
      item('Whole milk', '250ml', 165, 9, 12, 9),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍚', [
      item('Dal makhani', '1.5 cups', 360, 15, 48, 12),
      item('Basmati rice (cooked)', '2 cups', 400, 8, 88, 1),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Paneer sabzi', '1 cup', 250, 16, 8, 18),
      item('Full-fat dahi', '150g', 100, 6, 8, 5),
    ]),
    meal('s2', 'Pre-Workout Snack', '4:30 PM', '💪', [
      item('Whey protein shake (water)', '1 scoop', 130, 25, 4, 2),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Granola bar', '1 bar', 200, 4, 32, 7),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍗', [
      item('Butter chicken', '300g', 420, 38, 14, 24),
      item('Multigrain roti', '3 pieces', 240, 8, 45, 5),
      item('Dal tadka', '1 cup', 220, 12, 32, 5),
    ]),
  ],
};

const indian_bulk_veg: DayMealPlan = {
  ...indian_bulk_any,
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🫓', [
      item('Aloo-paneer paratha', '2 pieces', 520, 16, 72, 18),
      item('Full-fat dahi', '200g', 130, 8, 10, 6),
      item('Whole milk', '300ml', 200, 10, 15, 11),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥛', [
      item('Banana', '2 large', 200, 2, 52, 0),
      item('Peanut butter', '2 tbsp', 180, 8, 6, 16),
      item('Masala milk', '250ml', 180, 9, 18, 7),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍚', [
      item('Dal makhani', '1.5 cups', 360, 15, 48, 12),
      item('Basmati rice (cooked)', '2 cups', 400, 8, 88, 1),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Shahi paneer', '1 cup', 310, 18, 10, 22),
      item('Full-fat dahi', '150g', 100, 6, 8, 5),
    ]),
    meal('s2', 'Pre-Workout Snack', '4:30 PM', '💪', [
      item('Paneer sandwich (multigrain)', '2 slices', 280, 16, 28, 10),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Whole milk', '250ml', 165, 9, 12, 9),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🧀', [
      item('Kadai paneer', '250g', 380, 22, 12, 28),
      item('Multigrain roti', '3 pieces', 240, 8, 45, 5),
      item('Dal tadka', '1 cup', 220, 12, 32, 5),
    ]),
  ],
};

const indian_bulk_vegan: DayMealPlan = {
  ...indian_bulk_any,
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🍌', [
      item('Aloo paratha', '2 pieces', 500, 10, 78, 16),
      item('Coconut dahi (vegan)', '200g', 120, 2, 14, 6),
      item('Banana smoothie (oat milk)', '300ml', 250, 6, 42, 5),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥜', [
      item('Banana', '2 large', 200, 2, 52, 0),
      item('Almond butter', '2 tbsp', 190, 7, 7, 17),
      item('Oat milk', '250ml', 130, 4, 22, 3),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍚', [
      item('Rajma masala', '1.5 cups', 350, 18, 58, 5),
      item('Basmati rice (cooked)', '2 cups', 400, 8, 88, 1),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Tofu bhurji', '1 cup', 220, 18, 8, 13),
    ]),
    meal('s2', 'Pre-Workout Snack', '4:30 PM', '💪', [
      item('Vegan protein shake', '1 scoop', 140, 25, 7, 3),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Dates', '3 pieces', 80, 1, 21, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🫘', [
      item('Chana masala', '1.5 cups', 310, 16, 52, 6),
      item('Multigrain roti', '3 pieces', 240, 8, 45, 5),
      item('Tofu tikka masala', '200g', 250, 20, 10, 14),
    ]),
  ],
};

const indian_maintain_any: DayMealPlan = {
  cuisineLabel: 'Indian',
  totalCalories: 2500,
  tip: 'Balance your thali — dal + sabzi + roti + dahi covers all macro groups. Vary the sabzi daily for micronutrients.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥘', [
      item('Moong dal chilla', '3 pieces', 270, 18, 30, 5),
      item('Mint chutney', '2 tbsp', 20, 1, 3, 0),
      item('Masala chai (low sugar)', '1 cup', 50, 2, 7, 2),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍇', [
      item('Mixed fruit bowl', '1 cup', 100, 1, 25, 0),
      item('Roasted cashews', '20g', 115, 4, 6, 10),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Dal tadka', '1 cup', 220, 12, 32, 5),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Aloo-gobi sabzi', '1 cup', 130, 4, 18, 5),
      item('Brown rice', '¾ cup', 165, 4, 36, 1),
      item('Cucumber raita', '100g', 60, 3, 6, 2),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍿', [
      item('Roasted makhana', '30g', 120, 4, 23, 1),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍗', [
      item('Grilled chicken', '180g', 240, 36, 0, 10),
      item('Palak dal', '1 cup', 180, 10, 26, 4),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Kachumber salad', '1 bowl', 40, 2, 7, 1),
    ]),
  ],
};

const indian_maintain_veg: DayMealPlan = {
  ...indian_maintain_any,
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Poha with vegetables', '1.5 cups', 240, 5, 45, 5),
      item('Mint chutney', '2 tbsp', 20, 1, 3, 0),
      item('Masala chai (low sugar)', '1 cup', 50, 2, 7, 2),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥛', [
      item('Mixed fruit bowl', '1 cup', 100, 1, 25, 0),
      item('Low-fat dahi', '150g', 65, 5, 6, 2),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Dal tadka', '1 cup', 220, 12, 32, 5),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Paneer bhurji', '100g', 200, 14, 5, 14),
      item('Brown rice', '½ cup', 110, 3, 24, 1),
      item('Dahi', '100g', 60, 3, 5, 3),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍿', [
      item('Roasted makhana', '30g', 120, 4, 23, 1),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🧀', [
      item('Paneer tikka masala (light)', '150g', 290, 20, 12, 18),
      item('Palak dal', '1 cup', 180, 10, 26, 4),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
    ]),
  ],
};

const indian_maintain_vegan: DayMealPlan = {
  ...indian_maintain_any,
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥘', [
      item('Vegetable upma', '1.5 cups', 250, 6, 42, 5),
      item('Coconut chutney', '2 tbsp', 60, 1, 3, 5),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍇', [
      item('Mixed fruit bowl', '1 cup', 100, 1, 25, 0),
      item('Chia seeds', '15g', 75, 3, 5, 5),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍛', [
      item('Chana dal', '1 cup', 210, 13, 35, 3),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Aloo-gobi sabzi', '1 cup', 130, 4, 18, 5),
      item('Brown rice', '½ cup', 110, 3, 24, 1),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🥜', [
      item('Roasted chana', '40g', 140, 8, 20, 3),
      item('Kokum water', '250ml', 25, 0, 6, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🫘', [
      item('Tofu palak', '200g', 220, 18, 10, 12),
      item('Multigrain roti', '2 pieces', 160, 5, 30, 3),
      item('Mixed dal', '1 cup', 200, 12, 32, 3),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// JAPANESE meal templates
// ---------------------------------------------------------------------------

const japanese_cut_any: DayMealPlan = {
  cuisineLabel: 'Japanese',
  totalCalories: 1900,
  tip: 'Japanese cuisine is naturally portion-controlled. Use dashi-based soups to stay full without extra calories.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🍱', [
      item('Tamagoyaki (rolled omelette)', '2-egg roll', 140, 10, 4, 9),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Steamed rice', '½ cup', 100, 2, 22, 0),
      item('Green tea (sencha)', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍙', [
      item('Onigiri (salmon)', '1 piece', 185, 9, 32, 3),
      item('Matcha green tea', '1 cup', 10, 1, 1, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🐟', [
      item('Grilled salmon', '150g', 230, 28, 0, 13),
      item('Steamed rice', '¾ cup', 150, 3, 33, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Edamame', '½ cup', 95, 8, 8, 4),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🥟', [
      item('Gyoza (steamed, 4 pieces)', '4 pieces', 160, 8, 20, 5),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍜', [
      item('Chicken teriyaki (grilled)', '180g', 250, 32, 8, 10),
      item('Steamed rice', '½ cup', 100, 2, 22, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Wakame salad', '1 bowl', 45, 2, 6, 2),
    ]),
  ],
};

const japanese_bulk_any: DayMealPlan = {
  cuisineLabel: 'Japanese',
  totalCalories: 3100,
  tip: 'Add extra rice portions and salmon sashimi. Natto is a high-protein, high-calorie powerhouse.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🍳', [
      item('Tamagoyaki', '3-egg roll', 210, 15, 6, 14),
      item('Natto (fermented soy)', '1 pack', 100, 8, 6, 5),
      item('Steamed rice', '1.5 cups', 300, 6, 66, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Whole milk', '200ml', 130, 7, 10, 7),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🍙', [
      item('Onigiri (tuna mayo)', '2 pieces', 380, 14, 60, 9),
      item('Edamame', '1 cup', 190, 16, 16, 8),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🐟', [
      item('Salmon teriyaki', '200g', 320, 38, 10, 15),
      item('Steamed rice', '2 cups', 400, 8, 88, 1),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Gyoza (6 pieces)', '6 pieces', 240, 12, 30, 8),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Protein shake', '1 scoop', 130, 25, 4, 2),
      item('Banana', '2 large', 200, 2, 52, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍜', [
      item('Tonkotsu ramen (with egg)', '1 bowl', 550, 28, 65, 18),
      item('Chashu pork', '100g', 250, 20, 2, 18),
      item('Steamed rice', '1 cup', 200, 4, 44, 0),
    ]),
  ],
};

const japanese_maintain_any: DayMealPlan = {
  cuisineLabel: 'Japanese',
  totalCalories: 2400,
  tip: 'Hara hachi bu — eat until 80% full. Vary proteins: salmon, tofu, chicken, and eggs all week.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🍱', [
      item('Tamagoyaki', '2-egg roll', 140, 10, 4, 9),
      item('Natto', '1 pack', 100, 8, 6, 5),
      item('Steamed rice', '¾ cup', 150, 3, 33, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍙', [
      item('Onigiri (salmon)', '1 piece', 185, 9, 32, 3),
      item('Matcha latte (oat milk)', '1 cup', 80, 3, 12, 2),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🐟', [
      item('Salmon don (rice bowl)', '1 bowl', 480, 30, 55, 14),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Edamame', '½ cup', 95, 8, 8, 4),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🟢', [
      item('Edamame', '½ cup', 95, 8, 8, 4),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍗', [
      item('Chicken teriyaki', '180g', 250, 32, 8, 10),
      item('Soba noodles (cooked)', '1 cup', 200, 7, 40, 1),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
      item('Cucumber sunomono', '1 bowl', 35, 1, 7, 0),
    ]),
  ],
};

// Simplified veg/vegan variants for Japanese (swap protein)
const japanese_cut_veg: DayMealPlan = { ...japanese_cut_any, meals: japanese_cut_any.meals.map(m => ({ ...m, items: m.items.map(i => i.name.includes('salmon') || i.name.includes('Salmon') ? { ...i, name: 'Grilled tofu steak', protein: 18, fat: 8 } : i.name.includes('Chicken') ? { ...i, name: 'Grilled agedashi tofu', protein: 12, fat: 7 } : i) })) };
const japanese_cut_vegan: DayMealPlan = { ...japanese_cut_veg };
const japanese_bulk_veg: DayMealPlan = { ...japanese_bulk_any };
const japanese_bulk_vegan: DayMealPlan = { ...japanese_bulk_any };
const japanese_maintain_veg: DayMealPlan = { ...japanese_maintain_any };
const japanese_maintain_vegan: DayMealPlan = { ...japanese_maintain_any };

// ---------------------------------------------------------------------------
// MEDITERRANEAN
// ---------------------------------------------------------------------------

const mediterranean_cut_any: DayMealPlan = {
  cuisineLabel: 'Mediterranean',
  totalCalories: 1950,
  tip: 'Olive oil, legumes, and fish are your core fat-loss allies. Greek yoghurt replaces heavy dressings.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🫙', [
      item('Greek yoghurt (2% fat)', '200g', 130, 18, 9, 3),
      item('Walnuts', '20g', 130, 3, 3, 13),
      item('Honey drizzle', '1 tsp', 20, 0, 5, 0),
      item('Whole-wheat pita', '½ piece', 80, 3, 16, 1),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫒', [
      item('Mixed olives', '30g', 60, 0, 2, 6),
      item('Hummus', '3 tbsp', 80, 3, 8, 5),
      item('Veggie sticks (cucumber, carrot)', '1 cup', 35, 1, 7, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥙', [
      item('Falafel', '4 pieces', 200, 7, 24, 9),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
      item('Tabbouleh', '½ cup', 80, 2, 12, 3),
      item('Tzatziki', '50g', 55, 3, 4, 3),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🧆', [
      item('Labneh', '70g', 90, 6, 4, 6),
      item('Cucumber & mint', '½ cup', 20, 1, 4, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Grilled sea bass', '200g', 220, 36, 0, 8),
      item('Greek salad', '1 bowl', 120, 4, 8, 8),
      item('Hummus', '3 tbsp', 80, 3, 8, 5),
      item('Whole-wheat pita', '½ piece', 80, 3, 16, 1),
    ]),
  ],
};

const mediterranean_bulk_any: DayMealPlan = {
  cuisineLabel: 'Mediterranean',
  totalCalories: 3100,
  tip: 'Load up on olive oil, chickpeas, and fatty fish. Labneh + pita makes an easy high-calorie snack.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🍳', [
      item('Shakshuka (2 eggs in tomato sauce)', '1 pan', 280, 16, 18, 14),
      item('Whole-wheat pita', '2 pieces', 320, 12, 64, 4),
      item('Labneh', '100g', 130, 9, 6, 8),
      item('Whole milk', '200ml', 130, 7, 10, 7),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥜', [
      item('Hummus', '6 tbsp', 160, 6, 16, 10),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
      item('Mixed nuts', '30g', 180, 5, 6, 16),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥙', [
      item('Grilled chicken shawarma', '250g', 380, 42, 12, 18),
      item('Rice pilaf', '1.5 cups', 300, 6, 66, 3),
      item('Tabbouleh', '1 cup', 160, 4, 24, 6),
      item('Tzatziki', '75g', 80, 5, 6, 4),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Protein shake', '1 scoop', 130, 25, 4, 2),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Date & almond bar', '1 bar', 180, 4, 30, 6),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Grilled salmon', '250g', 400, 46, 0, 24),
      item('Rice with herbs', '1.5 cups', 300, 6, 66, 3),
      item('Greek salad', '1 large bowl', 160, 5, 11, 11),
      item('Hummus + pita', '4 tbsp + ½ pita', 160, 6, 20, 8),
    ]),
  ],
};

const mediterranean_maintain_any: DayMealPlan = {
  cuisineLabel: 'Mediterranean',
  totalCalories: 2500,
  tip: 'Rotate between fish, chicken, legumes, and eggs across the week for complete amino acid coverage.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🫙', [
      item('Greek yoghurt', '200g', 130, 18, 9, 3),
      item('Mixed berries', '½ cup', 40, 1, 9, 0),
      item('Walnuts', '20g', 130, 3, 3, 13),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫒', [
      item('Hummus', '4 tbsp', 110, 4, 11, 6),
      item('Veggie sticks', '1 cup', 35, 1, 7, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥙', [
      item('Chicken souvlaki wrap', '1 large', 420, 34, 42, 12),
      item('Tabbouleh', '½ cup', 80, 2, 12, 3),
      item('Labneh', '50g', 65, 4, 3, 4),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🧆', [
      item('Falafel', '3 pieces', 150, 5, 18, 7),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked cod with lemon herbs', '200g', 190, 34, 0, 4),
      item('Couscous', '1 cup cooked', 175, 6, 36, 0),
      item('Greek salad', '1 bowl', 120, 4, 8, 8),
    ]),
  ],
};

// Veg/vegan Mediterranean
const mediterranean_cut_veg: DayMealPlan = { ...mediterranean_cut_any };
const mediterranean_cut_vegan: DayMealPlan = { ...mediterranean_cut_any };
const mediterranean_bulk_veg: DayMealPlan = { ...mediterranean_bulk_any };
const mediterranean_bulk_vegan: DayMealPlan = { ...mediterranean_bulk_any };
const mediterranean_maintain_veg: DayMealPlan = { ...mediterranean_maintain_any };
const mediterranean_maintain_vegan: DayMealPlan = { ...mediterranean_maintain_any };

// ---------------------------------------------------------------------------
// WESTERN
// ---------------------------------------------------------------------------

const western_cut_any: DayMealPlan = {
  cuisineLabel: 'Western',
  totalCalories: 1900,
  tip: 'Prioritise protein at every meal — eggs, chicken breast, Greek yoghurt, and cottage cheese are your best tools.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🍳', [
      item('Scrambled eggs', '3 large', 210, 18, 2, 14),
      item('Whole-wheat toast', '2 slices', 160, 6, 30, 2),
      item('Avocado', '½ medium', 80, 1, 4, 7),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫙', [
      item('Greek yoghurt (0% fat)', '200g', 110, 18, 8, 0),
      item('Mixed berries', '½ cup', 40, 1, 9, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥗', [
      item('Grilled chicken breast', '180g', 220, 40, 0, 5),
      item('Whole-wheat wrap', '1 large', 180, 6, 34, 3),
      item('Mixed greens + veggies', '2 cups', 40, 2, 8, 0),
      item('Mustard dressing', '1 tbsp', 20, 0, 2, 1),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('Almond butter', '1 tbsp', 95, 3, 3, 9),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked salmon fillet', '180g', 280, 34, 0, 16),
      item('Roasted asparagus', '1 cup', 40, 4, 6, 0),
      item('Sweet potato (roasted)', '150g', 130, 3, 30, 0),
    ]),
  ],
};

const western_bulk_any: DayMealPlan = {
  cuisineLabel: 'Western',
  totalCalories: 3200,
  tip: 'Never skip post-workout carbs. Oats, sweet potato, whole grain pasta — all great mass builders.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🥞', [
      item('Protein pancakes', '3 large', 420, 30, 48, 10),
      item('Scrambled eggs', '2 large', 140, 12, 2, 9),
      item('Whole milk', '300ml', 200, 10, 15, 11),
      item('Banana', '1 large', 100, 1, 26, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🫙', [
      item('Cottage cheese', '200g', 160, 28, 6, 2),
      item('Whole-wheat toast', '2 slices', 160, 6, 30, 2),
      item('Peanut butter', '2 tbsp', 180, 8, 6, 16),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥩', [
      item('Grilled chicken thighs', '250g', 420, 44, 0, 26),
      item('Brown rice', '1.5 cups cooked', 325, 7, 70, 3),
      item('Steamed broccoli + carrots', '1.5 cups', 60, 3, 12, 0),
      item('Whole-wheat roll', '1 large', 180, 6, 36, 2),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Whey protein shake', '1 scoop', 130, 25, 4, 2),
      item('Oats (dry)', '60g', 220, 7, 40, 4),
      item('Banana', '1 large', 100, 1, 26, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🥩', [
      item('Lean beef steak', '250g', 450, 52, 0, 26),
      item('Mashed sweet potato', '200g', 180, 4, 42, 0),
      item('Steamed green beans', '1 cup', 35, 2, 7, 0),
      item('Whole milk', '200ml', 130, 7, 10, 7),
    ]),
  ],
};

const western_maintain_any: DayMealPlan = {
  cuisineLabel: 'Western',
  totalCalories: 2500,
  tip: 'Meal prep on Sundays — grill chicken, roast veggies, and cook a big batch of grains to eat all week.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Overnight oats', '1 cup', 300, 12, 52, 7),
      item('Chia seeds', '15g', 75, 3, 5, 5),
      item('Blueberries', '½ cup', 40, 1, 10, 0),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫙', [
      item('Greek yoghurt', '175g', 100, 15, 7, 1),
      item('Walnuts', '15g', 100, 2, 2, 10),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥗', [
      item('Grilled chicken salad bowl', '1 large', 380, 36, 22, 14),
      item('Quinoa', '½ cup cooked', 110, 4, 20, 2),
      item('Whole-wheat roll', '1 small', 120, 4, 23, 2),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('Almond butter', '1 tbsp', 95, 3, 3, 9),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked salmon', '180g', 280, 34, 0, 16),
      item('Quinoa', '¾ cup cooked', 165, 6, 30, 3),
      item('Roasted broccoli + peppers', '1.5 cups', 70, 4, 13, 1),
    ]),
  ],
};

const western_cut_veg: DayMealPlan = { ...western_cut_any };
const western_cut_vegan: DayMealPlan = { ...western_cut_any };
const western_bulk_veg: DayMealPlan = { ...western_bulk_any };
const western_bulk_vegan: DayMealPlan = { ...western_bulk_any };
const western_maintain_veg: DayMealPlan = { ...western_maintain_any };
const western_maintain_vegan: DayMealPlan = { ...western_maintain_any };

// ---------------------------------------------------------------------------
// ASIAN (pan-Asian: Chinese/Korean/Thai influenced)
// ---------------------------------------------------------------------------

const asian_cut_any: DayMealPlan = {
  cuisineLabel: 'Asian',
  totalCalories: 1900,
  tip: 'Use light soy sauce and steaming over frying. Tofu and edamame hit your protein macros without extra fat.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Rice congee (with ginger)', '1.5 cups', 160, 4, 34, 1),
      item('Century egg', '1 egg', 70, 6, 1, 5),
      item('Steamed fish fillet', '100g', 105, 20, 0, 2),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🧆', [
      item('Steamed bao bun (veggie)', '1 piece', 150, 5, 28, 2),
      item('Oolong tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍜', [
      item('Stir-fried chicken with vegetables', '200g', 260, 30, 12, 8),
      item('Steamed jasmine rice', '¾ cup', 150, 3, 33, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🟢', [
      item('Edamame', '1 cup', 190, 16, 16, 8),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍱', [
      item('Korean-style grilled beef (bulgogi)', '180g', 290, 30, 12, 13),
      item('Steamed rice', '½ cup', 100, 2, 22, 0),
      item('Kimchi', '½ cup', 30, 1, 5, 0),
      item('Seasoned spinach (sigeumchi-namul)', '1 cup', 60, 3, 8, 2),
    ]),
  ],
};

const asian_bulk_any: DayMealPlan = {
  cuisineLabel: 'Asian',
  totalCalories: 3100,
  tip: 'Rice is your best friend for bulking. Pair it with protein at every meal — tofu, fish, or chicken.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🍳', [
      item('Rice congee with pork', '2 cups', 320, 18, 50, 6),
      item('Steamed egg custard', '1 bowl', 140, 12, 4, 8),
      item('Whole milk', '250ml', 165, 9, 12, 9),
      item('Steamed bao', '2 pieces', 300, 10, 56, 4),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥜', [
      item('Peanut butter on rice cake', '2 cakes + 2 tbsp', 280, 8, 34, 16),
      item('Banana', '2 large', 200, 2, 52, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍜', [
      item('Beef and broccoli stir-fry', '250g', 380, 36, 18, 18),
      item('Steamed rice', '2 cups', 400, 8, 88, 1),
      item('Pork dumplings (steamed)', '6 pieces', 240, 12, 30, 8),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Protein shake', '1 scoop', 130, 25, 4, 2),
      item('Mango', '1 cup', 100, 1, 25, 0),
      item('Rice crackers', '30g', 120, 2, 26, 1),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍱', [
      item('Bibimbap (rice bowl)', '1 large bowl', 560, 24, 82, 14),
      item('Teriyaki salmon', '200g', 320, 38, 10, 15),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
    ]),
  ],
};

const asian_maintain_any: DayMealPlan = {
  cuisineLabel: 'Asian',
  totalCalories: 2500,
  tip: 'Vary your proteins across the week — fish Monday, tofu Wednesday, chicken Friday keeps nutrition broad.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Rice congee', '1.5 cups', 160, 4, 34, 1),
      item('Soft-boiled egg', '2 eggs', 140, 12, 2, 10),
      item('Steamed fish', '100g', 105, 20, 0, 2),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍙', [
      item('Onigiri (tuna)', '1 piece', 185, 9, 32, 3),
      item('Oolong tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍜', [
      item('Chicken stir-fry with vegetables', '200g', 260, 30, 12, 8),
      item('Steamed rice', '1.5 cups', 300, 6, 66, 0),
      item('Miso soup', '1 bowl', 40, 3, 5, 1),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🟢', [
      item('Edamame', '½ cup', 95, 8, 8, 4),
      item('Green tea', '1 cup', 5, 0, 1, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🍱', [
      item('Salmon teriyaki', '180g', 280, 34, 8, 13),
      item('Steamed rice', '1 cup', 200, 4, 44, 0),
      item('Kimchi + seasoned spinach', '1 cup', 90, 4, 13, 2),
    ]),
  ],
};

const asian_cut_veg: DayMealPlan = { ...asian_cut_any };
const asian_cut_vegan: DayMealPlan = { ...asian_cut_any };
const asian_bulk_veg: DayMealPlan = { ...asian_bulk_any };
const asian_bulk_vegan: DayMealPlan = { ...asian_bulk_any };
const asian_maintain_veg: DayMealPlan = { ...asian_maintain_any };
const asian_maintain_vegan: DayMealPlan = { ...asian_maintain_any };

// ---------------------------------------------------------------------------
// MEXICAN
// ---------------------------------------------------------------------------

const mexican_cut_any: DayMealPlan = {
  cuisineLabel: 'Mexican',
  totalCalories: 1950,
  tip: 'Choose corn tortillas over flour — lower GI and more fibre. Black beans are your high-protein base.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🍳', [
      item('Huevos rancheros (2 eggs)', '2 eggs', 200, 14, 6, 13),
      item('Corn tortillas', '2 small', 120, 3, 24, 2),
      item('Pico de gallo', '3 tbsp', 20, 0, 4, 0),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥑', [
      item('Guacamole', '50g', 80, 1, 4, 7),
      item('Jicama sticks', '1 cup', 45, 1, 11, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🌮', [
      item('Chicken taco filling (grilled)', '180g', 240, 34, 2, 9),
      item('Corn tortillas', '3 small', 180, 4, 36, 3),
      item('Pico de gallo + salsa verde', '4 tbsp', 30, 1, 6, 0),
      item('Shredded cabbage', '½ cup', 15, 1, 3, 0),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🫘', [
      item('Bean and cheese quesadilla (½)', '½ piece', 180, 8, 22, 7),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Grilled tilapia with lime', '200g', 210, 36, 0, 6),
      item('Black beans', '½ cup', 110, 7, 20, 0),
      item('Mexican-style rice', '½ cup', 110, 2, 24, 1),
      item('Pico de gallo salad', '1 bowl', 40, 1, 8, 0),
    ]),
  ],
};

const mexican_bulk_any: DayMealPlan = {
  cuisineLabel: 'Mexican',
  totalCalories: 3100,
  tip: 'Beans + rice + meat is a complete muscle-building trio. Add avocado and cheese for calorie-dense extras.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🥚', [
      item('Breakfast burrito (eggs, beans, cheese)', '1 large', 560, 28, 60, 22),
      item('Flour tortilla', '1 large', 200, 5, 36, 4),
      item('Whole milk', '300ml', 200, 10, 15, 11),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🫘', [
      item('Refried beans on toast', '2 slices + beans', 280, 14, 42, 5),
      item('Cheddar cheese', '30g', 120, 7, 0, 10),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🌯', [
      item('Carne asada (grilled beef)', '250g', 400, 48, 0, 22),
      item('Mexican rice', '1.5 cups', 330, 6, 72, 3),
      item('Black beans', '1 cup', 220, 14, 40, 1),
      item('Flour tortilla', '2 large', 400, 10, 72, 8),
      item('Guacamole', '50g', 80, 1, 4, 7),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Protein shake', '1 scoop', 130, 25, 4, 2),
      item('Banana', '1 large', 100, 1, 26, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🌮', [
      item('Grilled chicken fajitas', '250g chicken', 350, 46, 8, 14),
      item('Flour tortillas', '3 large', 600, 15, 108, 12),
      item('Sautéed peppers & onions', '1 cup', 80, 2, 14, 2),
      item('Sour cream', '2 tbsp', 60, 1, 2, 5),
    ]),
  ],
};

const mexican_maintain_any: DayMealPlan = {
  cuisineLabel: 'Mexican',
  totalCalories: 2450,
  tip: 'Salsa verde and pico de gallo add flavour with almost no calories — use liberally to keep meals satisfying.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🍳', [
      item('Egg white omelette with veggies', '3 whites + 1 yolk', 180, 18, 6, 7),
      item('Corn tortillas', '2 small', 120, 3, 24, 2),
      item('Salsa', '3 tbsp', 15, 0, 3, 0),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥑', [
      item('Guacamole', '50g', 80, 1, 4, 7),
      item('Corn chips (baked)', '20g', 80, 2, 16, 1),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🌮', [
      item('Chicken taco bowl', '1 bowl', 480, 38, 44, 14),
      item('Black beans', '½ cup', 110, 7, 20, 0),
      item('Pico de gallo', '3 tbsp', 20, 0, 4, 0),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🫘', [
      item('Bean quesadilla (½)', '½ piece', 180, 8, 22, 7),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Fish tacos (baked)', '2 tacos', 360, 28, 36, 10),
      item('Mexican slaw', '1 cup', 80, 2, 10, 4),
      item('Mexican rice', '½ cup', 110, 2, 24, 1),
    ]),
  ],
};

const mexican_cut_veg: DayMealPlan = { ...mexican_cut_any };
const mexican_cut_vegan: DayMealPlan = { ...mexican_cut_any };
const mexican_bulk_veg: DayMealPlan = { ...mexican_bulk_any };
const mexican_bulk_vegan: DayMealPlan = { ...mexican_bulk_any };
const mexican_maintain_veg: DayMealPlan = { ...mexican_maintain_any };
const mexican_maintain_vegan: DayMealPlan = { ...mexican_maintain_any };

// ---------------------------------------------------------------------------
// MIDDLE EASTERN
// ---------------------------------------------------------------------------

const middleEastern_cut_any: DayMealPlan = {
  cuisineLabel: 'Middle Eastern',
  totalCalories: 1950,
  tip: 'Foul medames and hummus are protein-rich breakfasts that keep you full until lunch. Avoid fried falafel — bake it.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🫘', [
      item('Foul medames (fava beans)', '¾ cup', 180, 11, 28, 3),
      item('Whole-wheat pita', '1 small', 120, 4, 24, 1),
      item('Olives (5 pieces)', '5 pieces', 35, 0, 1, 4),
      item('Mint tea', '1 cup', 10, 0, 2, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🥒', [
      item('Hummus', '3 tbsp', 80, 3, 8, 5),
      item('Cucumber & radish sticks', '1 cup', 25, 1, 5, 0),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥙', [
      item('Chicken shawarma (grilled)', '200g', 320, 36, 8, 14),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
      item('Tabbouleh', '½ cup', 80, 2, 12, 3),
      item('Garlic sauce (1 tbsp)', '1 tbsp', 40, 0, 2, 4),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🌴', [
      item('Dates', '3 pieces', 80, 1, 21, 0),
      item('Almonds', '20g', 120, 4, 4, 10),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🥗', [
      item('Grilled kofta (chicken)', '200g', 280, 30, 4, 16),
      item('Fattoush salad', '1 large bowl', 120, 3, 16, 5),
      item('Labneh', '60g', 80, 5, 4, 5),
    ]),
  ],
};

const middleEastern_bulk_any: DayMealPlan = {
  cuisineLabel: 'Middle Eastern',
  totalCalories: 3100,
  tip: 'Lamb, rice, and legumes are the calorie-dense core of Middle Eastern bulk eating. Add tahini for healthy fats.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🍳', [
      item('Shakshuka (3 eggs)', '3 eggs', 330, 22, 18, 18),
      item('Whole-wheat pita', '2 pieces', 320, 12, 64, 4),
      item('Labneh', '100g', 130, 9, 6, 8),
      item('Whole milk', '250ml', 165, 9, 12, 9),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥜', [
      item('Hummus', '6 tbsp', 160, 6, 16, 10),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
      item('Mixed nuts & dates', '40g', 200, 5, 24, 12),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🍖', [
      item('Lamb shawarma', '250g', 450, 40, 10, 28),
      item('Rice pilaf', '2 cups', 400, 8, 88, 4),
      item('Fattoush', '1 bowl', 120, 3, 16, 5),
      item('Hummus + pita', '4 tbsp + 1 pita', 240, 10, 40, 13),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Protein shake', '1 scoop', 130, 25, 4, 2),
      item('Dates', '5 pieces', 135, 1, 36, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🥙', [
      item('Grilled kofta (lamb)', '250g', 400, 36, 6, 26),
      item('Rice', '1.5 cups', 300, 6, 66, 1),
      item('Tabbouleh', '1 cup', 160, 4, 24, 6),
    ]),
  ],
};

const middleEastern_maintain_any: DayMealPlan = {
  cuisineLabel: 'Middle Eastern',
  totalCalories: 2500,
  tip: 'Za\'atar and olive oil on pita makes a perfectly balanced snack. Vary proteins: chicken, fish, lamb, and legumes.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🫘', [
      item('Foul medames', '¾ cup', 180, 11, 28, 3),
      item('Whole-wheat pita', '1 small', 120, 4, 24, 1),
      item('Labneh', '60g', 80, 5, 4, 5),
      item('Mint tea', '1 cup', 10, 0, 2, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫒', [
      item('Hummus', '4 tbsp', 110, 4, 11, 6),
      item('Pita chips (baked)', '20g', 80, 2, 14, 2),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥙', [
      item('Chicken shawarma', '200g', 320, 36, 8, 14),
      item('Whole-wheat pita', '1 piece', 160, 6, 32, 2),
      item('Tabbouleh', '½ cup', 80, 2, 12, 3),
      item('Garlic sauce', '1 tbsp', 40, 0, 2, 4),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🌴', [
      item('Dates', '3 pieces', 80, 1, 21, 0),
      item('Almonds', '20g', 120, 4, 4, 10),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Grilled fish (hammour)', '200g', 200, 36, 0, 6),
      item('Rice pilaf', '1 cup', 200, 4, 44, 2),
      item('Fattoush salad', '1 bowl', 120, 3, 16, 5),
    ]),
  ],
};

const middleEastern_cut_veg: DayMealPlan = { ...middleEastern_cut_any };
const middleEastern_cut_vegan: DayMealPlan = { ...middleEastern_cut_any };
const middleEastern_bulk_veg: DayMealPlan = { ...middleEastern_bulk_any };
const middleEastern_bulk_vegan: DayMealPlan = { ...middleEastern_bulk_any };
const middleEastern_maintain_veg: DayMealPlan = { ...middleEastern_maintain_any };
const middleEastern_maintain_vegan: DayMealPlan = { ...middleEastern_maintain_any };

// ---------------------------------------------------------------------------
// BALANCED
// ---------------------------------------------------------------------------

const balanced_cut_any: DayMealPlan = {
  cuisineLabel: 'Balanced',
  totalCalories: 1900,
  tip: 'Whole foods, lean proteins, and complex carbs at every meal. Prep a protein source on Sunday to make weekdays easy.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Rolled oats (cooked)', '1 cup', 150, 5, 27, 3),
      item('Banana', '1 medium', 90, 1, 23, 0),
      item('Chia seeds', '15g', 75, 3, 5, 5),
      item('Almond milk (unsweetened)', '200ml', 40, 1, 3, 3),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('Mixed nuts', '25g', 150, 4, 5, 13),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥗', [
      item('Grilled chicken breast', '180g', 220, 40, 0, 5),
      item('Quinoa (cooked)', '¾ cup', 165, 6, 30, 3),
      item('Mixed greens + cherry tomatoes + cucumber', '2 cups', 40, 2, 8, 0),
      item('Tahini dressing', '2 tbsp', 90, 3, 3, 8),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🫙', [
      item('Greek yoghurt (0% fat)', '150g', 80, 13, 6, 0),
      item('Berries', '½ cup', 40, 1, 9, 0),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked salmon', '180g', 280, 34, 0, 16),
      item('Roasted sweet potato', '150g', 130, 3, 30, 0),
      item('Steamed broccoli', '1.5 cups', 55, 4, 10, 1),
    ]),
  ],
};

const balanced_bulk_any: DayMealPlan = {
  cuisineLabel: 'Balanced',
  totalCalories: 3200,
  tip: 'Add calorie density through nuts, nut butters, olive oil, and whole grains — not junk food.',
  meals: [
    meal('b', 'Breakfast', '7:00 AM', '🥞', [
      item('Oat protein pancakes', '3 large', 450, 32, 50, 12),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Whole milk', '300ml', 200, 10, 15, 11),
      item('Scrambled eggs (2)', '2 large', 140, 12, 2, 9),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:00 AM', '🥜', [
      item('Peanut butter on whole-wheat toast', '2 slices + 2 tbsp', 380, 16, 36, 22),
      item('Whole milk', '250ml', 165, 9, 12, 9),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥩', [
      item('Grilled chicken thighs', '250g', 420, 44, 0, 26),
      item('Brown rice', '2 cups cooked', 440, 9, 94, 4),
      item('Roasted vegetables', '1.5 cups', 90, 4, 18, 2),
      item('Olive oil drizzle', '1 tbsp', 120, 0, 0, 14),
    ]),
    meal('s2', 'Pre-Workout', '4:30 PM', '💪', [
      item('Whey protein shake', '1 scoop', 130, 25, 4, 2),
      item('Banana', '1 large', 100, 1, 26, 0),
      item('Oats (dry)', '40g', 150, 5, 27, 3),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked salmon', '250g', 400, 46, 0, 24),
      item('Quinoa', '1.5 cups cooked', 330, 12, 60, 6),
      item('Roasted broccoli + carrots', '1.5 cups', 70, 4, 13, 1),
      item('Whole milk', '200ml', 130, 7, 10, 7),
    ]),
  ],
};

const balanced_maintain_any: DayMealPlan = {
  cuisineLabel: 'Balanced',
  totalCalories: 2500,
  tip: 'Rotate proteins and grains daily — variety ensures you get all essential micronutrients.',
  meals: [
    meal('b', 'Breakfast', '7:30 AM', '🥣', [
      item('Overnight oats with chia', '1 cup', 300, 12, 52, 7),
      item('Blueberries', '½ cup', 40, 1, 10, 0),
      item('Black coffee', '1 cup', 5, 0, 1, 0),
    ]),
    meal('s1', 'Mid-Morning Snack', '10:30 AM', '🫙', [
      item('Greek yoghurt', '175g', 100, 15, 7, 1),
      item('Mixed nuts', '20g', 120, 3, 4, 11),
    ]),
    meal('l', 'Lunch', '1:00 PM', '🥗', [
      item('Grilled chicken or tofu bowl', '200g protein', 300, 38, 8, 10),
      item('Quinoa', '¾ cup cooked', 165, 6, 30, 3),
      item('Roasted vegetables', '1.5 cups', 90, 4, 18, 2),
      item('Tahini dressing', '1.5 tbsp', 70, 2, 2, 6),
    ]),
    meal('s2', 'Afternoon Snack', '4:30 PM', '🍎', [
      item('Apple', '1 medium', 80, 0, 21, 0),
      item('Almond butter', '1 tbsp', 95, 3, 3, 9),
    ]),
    meal('d', 'Dinner', '7:30 PM', '🐟', [
      item('Baked salmon', '180g', 280, 34, 0, 16),
      item('Brown rice', '¾ cup cooked', 165, 4, 36, 1),
      item('Steamed broccoli + asparagus', '1.5 cups', 60, 5, 10, 0),
    ]),
  ],
};

const balanced_cut_veg: DayMealPlan = { ...balanced_cut_any };
const balanced_cut_vegan: DayMealPlan = { ...balanced_cut_any };
const balanced_bulk_veg: DayMealPlan = { ...balanced_bulk_any };
const balanced_bulk_vegan: DayMealPlan = { ...balanced_bulk_any };
const balanced_maintain_veg: DayMealPlan = { ...balanced_maintain_any };
const balanced_maintain_vegan: DayMealPlan = { ...balanced_maintain_any };

// ---------------------------------------------------------------------------
// Master lookup table
// ---------------------------------------------------------------------------

type PlanMatrix = {
  cut: { any: DayMealPlan; veg: DayMealPlan; vegan: DayMealPlan };
  bulk: { any: DayMealPlan; veg: DayMealPlan; vegan: DayMealPlan };
  maintain: { any: DayMealPlan; veg: DayMealPlan; vegan: DayMealPlan };
};

const PLANS: Record<Cuisine, PlanMatrix> = {
  indian: {
    cut: { any: indian_cut_any, veg: indian_cut_veg, vegan: indian_cut_vegan },
    bulk: { any: indian_bulk_any, veg: indian_bulk_veg, vegan: indian_bulk_vegan },
    maintain: { any: indian_maintain_any, veg: indian_maintain_veg, vegan: indian_maintain_vegan },
  },
  japanese: {
    cut: { any: japanese_cut_any, veg: japanese_cut_veg, vegan: japanese_cut_vegan },
    bulk: { any: japanese_bulk_any, veg: japanese_bulk_veg, vegan: japanese_bulk_vegan },
    maintain: { any: japanese_maintain_any, veg: japanese_maintain_veg, vegan: japanese_maintain_vegan },
  },
  mediterranean: {
    cut: { any: mediterranean_cut_any, veg: mediterranean_cut_veg, vegan: mediterranean_cut_vegan },
    bulk: { any: mediterranean_bulk_any, veg: mediterranean_bulk_veg, vegan: mediterranean_bulk_vegan },
    maintain: { any: mediterranean_maintain_any, veg: mediterranean_maintain_veg, vegan: mediterranean_maintain_vegan },
  },
  western: {
    cut: { any: western_cut_any, veg: western_cut_veg, vegan: western_cut_vegan },
    bulk: { any: western_bulk_any, veg: western_bulk_veg, vegan: western_bulk_vegan },
    maintain: { any: western_maintain_any, veg: western_maintain_veg, vegan: western_maintain_vegan },
  },
  asian: {
    cut: { any: asian_cut_any, veg: asian_cut_veg, vegan: asian_cut_vegan },
    bulk: { any: asian_bulk_any, veg: asian_bulk_veg, vegan: asian_bulk_vegan },
    maintain: { any: asian_maintain_any, veg: asian_maintain_veg, vegan: asian_maintain_vegan },
  },
  middle_eastern: {
    cut: { any: middleEastern_cut_any, veg: middleEastern_cut_veg, vegan: middleEastern_cut_vegan },
    bulk: { any: middleEastern_bulk_any, veg: middleEastern_bulk_veg, vegan: middleEastern_bulk_vegan },
    maintain: { any: middleEastern_maintain_any, veg: middleEastern_maintain_veg, vegan: middleEastern_maintain_vegan },
  },
  mexican: {
    cut: { any: mexican_cut_any, veg: mexican_cut_veg, vegan: mexican_cut_vegan },
    bulk: { any: mexican_bulk_any, veg: mexican_bulk_veg, vegan: mexican_bulk_vegan },
    maintain: { any: mexican_maintain_any, veg: mexican_maintain_veg, vegan: mexican_maintain_vegan },
  },
  balanced: {
    cut: { any: balanced_cut_any, veg: balanced_cut_veg, vegan: balanced_cut_vegan },
    bulk: { any: balanced_bulk_any, veg: balanced_bulk_veg, vegan: balanced_bulk_vegan },
    maintain: { any: balanced_maintain_any, veg: balanced_maintain_veg, vegan: balanced_maintain_vegan },
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getMealPlan(
  cuisine: Cuisine,
  diet: DietType,
  goal: Goal,
  targetCalories: number
): DayMealPlan {
  const base = PLANS[cuisine][goal][diet];
  return scalePlan(base, targetCalories);
}

export function getCuisineLabel(cuisine: Cuisine): string {
  const labels: Record<Cuisine, string> = {
    indian: 'Indian',
    japanese: 'Japanese',
    mediterranean: 'Mediterranean',
    western: 'Western',
    asian: 'Asian',
    middle_eastern: 'Middle Eastern',
    mexican: 'Mexican',
    balanced: 'Balanced',
  };
  return labels[cuisine];
}

export function getCuisineBadgeColor(cuisine: Cuisine): string {
  const colors: Record<Cuisine, string> = {
    indian: '#FF6B35',
    japanese: '#EC4899',
    mediterranean: '#3B82F6',
    western: '#10B981',
    asian: '#EF4444',
    middle_eastern: '#F59E0B',
    mexican: '#8B5CF6',
    balanced: '#6C63FF',
  };
  return colors[cuisine];
}
