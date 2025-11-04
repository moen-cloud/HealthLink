require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Article = require('./models/Article');

// Sample data
const users = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'doctor@healthlink.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567890',
    age: 42,
    gender: 'female'
  },
  {
    name: 'John Patient',
    email: 'patient@healthlink.com',
    password: 'patient123',
    role: 'patient',
    phone: '+0987654321',
    age: 30,
    gender: 'male',
    medicalHistory: [
      {
        condition: 'Seasonal Allergies',
        date: new Date('2023-04-15'),
        notes: 'Prescribed antihistamines'
      }
    ]
  }
];

const articles = [
  {
    title: 'Understanding COVID-19: Symptoms and Prevention',
    content: `COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Understanding its symptoms and prevention methods is crucial for protecting yourself and others.

**Common Symptoms:**
- Fever or chills
- Cough
- Shortness of breath or difficulty breathing
- Fatigue
- Muscle or body aches
- Headache
- New loss of taste or smell
- Sore throat
- Congestion or runny nose
- Nausea or vomiting
- Diarrhea

**Prevention Tips:**
1. Get vaccinated and stay up to date with booster shots
2. Wear a mask in crowded indoor spaces
3. Practice social distancing (6 feet apart)
4. Wash hands frequently with soap and water
5. Use hand sanitizer when soap isn't available
6. Avoid touching your face
7. Stay home when sick
8. Cover coughs and sneezes

**When to Seek Medical Help:**
Seek emergency care if you experience:
- Trouble breathing
- Persistent chest pain or pressure
- New confusion
- Inability to wake or stay awake
- Pale, gray, or blue-colored skin, lips, or nail beds

Remember, early detection and proper care can significantly improve outcomes. If you experience symptoms, get tested and isolate to prevent spreading the virus.`,
    category: 'diseases',
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800'
  },
  {
    title: 'The Importance of Mental Health in Overall Wellness',
    content: `Mental health is just as important as physical health. It affects how we think, feel, and act, influencing our daily lives, relationships, and physical health.

**Why Mental Health Matters:**
Mental health encompasses our emotional, psychological, and social well-being. It affects:
- How we handle stress
- How we relate to others
- How we make choices
- Our physical health
- Our productivity and success

**Common Mental Health Challenges:**
- Anxiety disorders
- Depression
- Stress
- Burnout
- Trauma and PTSD
- Seasonal affective disorder

**Tips for Maintaining Good Mental Health:**

1. **Stay Connected:** Build and maintain strong relationships with family and friends. Social support is crucial for mental well-being.

2. **Exercise Regularly:** Physical activity releases endorphins that improve mood and reduce stress. Aim for at least 30 minutes daily.

3. **Get Quality Sleep:** Establish a consistent sleep schedule. Most adults need 7-9 hours of quality sleep per night.

4. **Practice Mindfulness:** Meditation, deep breathing, and yoga can help reduce anxiety and improve focus.

5. **Eat Well:** A balanced diet supports brain health. Include omega-3 fatty acids, whole grains, and plenty of fruits and vegetables.

6. **Limit Alcohol and Avoid Drugs:** Substances can worsen mental health issues.

7. **Set Realistic Goals:** Break large tasks into smaller, manageable steps.

8. **Seek Help When Needed:** Don't hesitate to reach out to a mental health professional if you're struggling.

**Breaking the Stigma:**
Mental health issues are common and treatable. There's no shame in seeking help. Just as you would see a doctor for a physical ailment, consulting a mental health professional is a sign of strength, not weakness.

Remember, taking care of your mental health is an ongoing process. Small daily steps can lead to significant improvements in your overall well-being.`,
    category: 'mental-health',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800'
  },
  {
    title: 'Nutrition Basics: Building a Healthy Diet',
    content: `Good nutrition is fundamental to good health. Understanding nutrition basics can help you make informed decisions about your diet.

**The Five Food Groups:**

1. **Fruits and Vegetables:** Aim for 5+ servings daily. They provide essential vitamins, minerals, and fiber.

2. **Whole Grains:** Choose whole wheat, brown rice, oats, and quinoa. They provide sustained energy and fiber.

3. **Protein:** Include lean meats, fish, beans, nuts, and eggs. Protein is essential for muscle growth and repair.

4. **Dairy:** Choose low-fat options for calcium and vitamin D. Consider fortified plant-based alternatives if lactose intolerant.

5. **Healthy Fats:** Include olive oil, avocados, nuts, and fatty fish. These support heart and brain health.

**Key Nutrients:**

- **Protein:** Building blocks for muscles, bones, skin, and blood
- **Carbohydrates:** Primary energy source for your body
- **Fats:** Essential for hormone production and nutrient absorption
- **Vitamins:** Support various body functions from immunity to bone health
- **Minerals:** Important for bone health, fluid balance, and many other processes
- **Water:** Essential for every body function; aim for 8 glasses daily

**Healthy Eating Habits:**

1. **Eat Regular Meals:** Don't skip breakfast. Regular meals help maintain steady blood sugar levels.

2. **Portion Control:** Use smaller plates and be mindful of serving sizes.

3. **Read Labels:** Check nutrition facts for hidden sugars, sodium, and unhealthy fats.

4. **Limit Processed Foods:** Choose whole, unprocessed foods when possible.

5. **Reduce Sugar and Salt:** Excess can lead to health problems over time.

6. **Stay Hydrated:** Drink water throughout the day, especially before, during, and after exercise.

7. **Plan Ahead:** Meal planning can help you make healthier choices and save time.

**Foods to Emphasize:**
- Leafy greens (spinach, kale)
- Colorful vegetables
- Fresh fruits
- Whole grains
- Lean proteins
- Nuts and seeds
- Fatty fish (salmon, mackerel)

**Foods to Limit:**
- Sugary drinks and snacks
- Processed meats
- Trans fats
- Excessive sodium
- Refined grains

Remember, a healthy diet is about balance, not restriction. Allow yourself occasional treats while maintaining overall healthy eating patterns. Consult a registered dietitian for personalized nutrition advice.`,
    category: 'nutrition',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'
  },
  {
    title: 'Exercise Guide: Getting Started with Fitness',
    content: `Regular physical activity is one of the best things you can do for your health. Here's how to get started safely and effectively.

**Benefits of Regular Exercise:**
- Improves cardiovascular health
- Helps maintain healthy weight
- Strengthens bones and muscles
- Improves mental health and mood
- Increases energy levels
- Promotes better sleep
- Reduces risk of chronic diseases
- Enhances cognitive function

**Types of Exercise:**

1. **Aerobic (Cardio):**
   - Walking, jogging, cycling, swimming
   - Increases heart rate and breathing
   - Aim for 150 minutes of moderate or 75 minutes of vigorous activity weekly

2. **Strength Training:**
   - Weight lifting, resistance bands, bodyweight exercises
   - Builds muscle mass and bone density
   - Include all major muscle groups 2-3 times per week

3. **Flexibility:**
   - Stretching, yoga, tai chi
   - Improves range of motion
   - Helps prevent injuries

4. **Balance:**
   - Standing on one foot, heel-to-toe walk
   - Important for preventing falls, especially as we age

**Getting Started:**

1. **Consult Your Doctor:** Especially if you have health conditions or haven't exercised in a while.

2. **Start Slow:** Begin with just 10-15 minutes daily and gradually increase.

3. **Choose Activities You Enjoy:** You're more likely to stick with exercise if it's fun.

4. **Set Realistic Goals:** Start small and build up. Celebrate milestones.

5. **Create a Schedule:** Treat exercise like an important appointment.

6. **Warm Up and Cool Down:** Spend 5-10 minutes on each to prevent injury.

**Sample Weekly Plan for Beginners:**
- Monday: 30-minute brisk walk
- Tuesday: Strength training (upper body)
- Wednesday: 20-minute bike ride
- Thursday: Rest or gentle yoga
- Friday: Strength training (lower body)
- Saturday: 30-minute activity of choice
- Sunday: Rest or light stretching

**Safety Tips:**
- Stay hydrated before, during, and after exercise
- Wear appropriate footwear and clothing
- Listen to your body and rest when needed
- Use proper form to prevent injuries
- Stop if you experience pain, dizziness, or shortness of breath

**Staying Motivated:**
- Find a workout buddy
- Track your progress
- Vary your routine to prevent boredom
- Reward yourself for reaching goals
- Join a class or group
- Remember your "why"

**Overcoming Common Barriers:**
- **No time:** Break exercise into 10-minute sessions throughout the day
- **Too tired:** Exercise actually increases energy levels
- **Too expensive:** Many effective exercises are free (walking, bodyweight exercises)
- **Bad weather:** Have indoor alternatives ready

Remember, any movement is better than none. The key is consistency. Start where you are and progress at your own pace. Your future self will thank you!`,
    category: 'fitness',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
  },
  {
    title: 'Seasonal Flu: Prevention and Treatment',
    content: `The seasonal flu is a contagious respiratory illness caused by influenza viruses. Understanding how to prevent and treat it can help you stay healthy.

**Understanding the Flu:**
The flu is more than just a bad cold. It can cause mild to severe illness and sometimes lead to serious complications, especially in high-risk groups.

**High-Risk Groups:**
- Young children (especially under 2)
- Adults 65 and older
- Pregnant women
- People with chronic health conditions (asthma, diabetes, heart disease)
- Immunocompromised individuals

**Common Symptoms:**
- Sudden onset of fever (usually high)
- Cough
- Sore throat
- Runny or stuffy nose
- Body aches
- Headache
- Fatigue
- Sometimes vomiting and diarrhea (more common in children)

**Flu vs. Cold:**
While both are respiratory illnesses, flu symptoms typically come on suddenly and are more severe. Colds usually develop gradually and are milder.

**Prevention:**

1. **Get Vaccinated:** Annual flu vaccine is the best protection. Get it in early fall before flu season peaks.

2. **Practice Good Hygiene:**
   - Wash hands frequently with soap and water
   - Use hand sanitizer when soap isn't available
   - Avoid touching your face
   - Cover coughs and sneezes with tissue or elbow

3. **Avoid Close Contact:** Stay away from sick people and stay home when you're sick.

4. **Boost Your Immune System:**
   - Eat a healthy diet
   - Exercise regularly
   - Get adequate sleep
   - Manage stress
   - Stay hydrated

5. **Clean and Disinfect:** Regularly clean surfaces that are frequently touched.

**Treatment:**

**At Home:**
- Rest as much as possible
- Drink plenty of fluids (water, warm tea, soup)
- Use over-the-counter medications for fever and aches (acetaminophen or ibuprofen)
- Use a humidifier to ease congestion
- Gargle with salt water for sore throat

**When to See a Doctor:**
Most people recover without medical treatment, but see a doctor if you experience:
- Difficulty breathing or shortness of breath
- Persistent chest or abdominal pain
- Persistent dizziness or confusion
- Seizures
- Severe muscle pain
- Severe weakness
- Fever that returns after going away

**Antiviral Medications:**
Prescription antivirals (like oseltamivir) can shorten illness duration if taken within 48 hours of symptom onset. They're especially important for high-risk individuals.

**Recovery Tips:**
- Don't rush back to normal activities
- Continue drinking fluids even after feeling better
- Gradually increase activity levels
- Complete any prescribed medications
- You're contagious for about 5-7 days after symptoms begin

**Preventing Spread:**
If you have the flu:
- Stay home for at least 24 hours after fever subsides (without fever-reducing medication)
- Cover your mouth and nose
- Wash hands frequently
- Avoid close contact with others
- Clean surfaces you've touched

Remember, prevention is always better than cure. Make flu vaccination an annual habit and maintain good hygiene practices year-round.`,
    category: 'prevention',
    thumbnail: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Article.deleteMany();

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Find the doctor user for article authorship
    const doctor = createdUsers.find(user => user.role === 'doctor');

    // Add doctor as author to all articles
    const articlesWithAuthor = articles.map(article => ({
      ...article,
      author: doctor._id
    }));

    // Create articles
    console.log('📄 Creating articles...');
    const createdArticles = await Article.create(articlesWithAuthor);
    console.log(`✅ Created ${createdArticles.length} articles`);

    console.log('\n🌱 Database seeded successfully!\n');
    console.log('📋 Dummy Credentials:');
    console.log('   Doctor Login:');
    console.log('   Email: doctor@healthlink.com');
    console.log('   Password: doctor123\n');
    console.log('   Patient Login:');
    console.log('   Email: patient@healthlink.com');
    console.log('   Password: patient123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();