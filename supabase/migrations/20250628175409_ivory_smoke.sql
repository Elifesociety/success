/*
  # Insert default categories

  1. Data
    - Insert default category data with fees and features
*/

INSERT INTO categories (id, name, description, actual_fee, offer_fee, features) VALUES
(
  'pennyekart-free',
  'Pennyekart Free Registration',
  'Totally free registration with basic level access. Free delivery between 2pm to 6pm.',
  0,
  0,
  '["Free registration", "Free delivery (2pm-6pm)", "Basic level access", "E-commerce platform access"]'::jsonb
),
(
  'pennyekart-paid',
  'Pennyekart Paid Registration',
  'Premium registration with extended delivery hours and enhanced features.',
  500,
  299,
  '["Any time delivery (8am-7pm)", "Premium features", "Priority support", "Extended service hours"]'::jsonb
),
(
  'farmelife',
  'Farmelife',
  'Connected with dairy farm, poultry farm and agricultural businesses.',
  800,
  599,
  '["Dairy farm connections", "Poultry farm network", "Agricultural business support", "Farm-to-market solutions"]'::jsonb
),
(
  'organelife',
  'Organelife',
  'Connected with vegetable and house gardening, especially terrace vegetable farming.',
  600,
  399,
  '["Organic farming support", "Terrace gardening solutions", "Vegetable farming network", "Sustainable agriculture"]'::jsonb
),
(
  'foodelif',
  'Foodelif',
  'Connected with food processing business and culinary services.',
  700,
  499,
  '["Food processing business", "Culinary services", "Recipe sharing platform", "Food quality certification"]'::jsonb
),
(
  'entrelife',
  'Entrelife',
  'Connected with skilled projects like stitching, art works, and various home services.',
  650,
  449,
  '["Skilled project management", "Stitching and tailoring", "Art and craft services", "Home service network"]'::jsonb
),
(
  'job-card',
  'Job Card',
  'Special offer card with access to all categories, special discounts, and investment opportunities.',
  2000,
  999,
  '["Access to all categories", "Special fee cut packages", "Exclusive offers and discounts", "Investment card benefits", "Convertible to any category", "Points and profit system"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  actual_fee = EXCLUDED.actual_fee,
  offer_fee = EXCLUDED.offer_fee,
  features = EXCLUDED.features,
  updated_at = now();