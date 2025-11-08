import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaSearch,
  FaArrowLeft,
  FaSpinner,
  FaPlus,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default beginner lessons
const defaultLessons = [
  {
    id: "lesson-1",
    title: "The English Alphabet",
    category: "Basics",
    level: "Beginner",
    description: "Learn all 26 letters of the English alphabet with pronunciation",
    content: `# The English Alphabet

## Overview
The English alphabet has 26 letters: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z

## Vowels
There are 5 vowels: **A, E, I, O, U**

## Consonants
The remaining 21 letters are consonants.

## Practice
Try to write the alphabet in both uppercase and lowercase:
- Uppercase: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
- Lowercase: a b c d e f g h i j k l m n o p q r s t u v w x y z`,
    duration: "10 min",
    isDefault: true,
  },
  {
    id: "lesson-2",
    title: "Greetings and Introductions",
    category: "Speaking",
    level: "Beginner",
    description: "Learn how to greet people and introduce yourself in English",
    content: `# Greetings and Introductions

## Basic Greetings
- **Hello** - formal and informal
- **Hi** - informal
- **Good morning** - before 12 PM
- **Good afternoon** - 12 PM to 5 PM
- **Good evening** - after 5 PM

## Introducing Yourself
- My name is [Your Name]
- I am from [Your Country]
- Nice to meet you
- How do you do?

## Asking Someone's Name
- What's your name?
- May I know your name?

## Practice Dialogue
**Person A:** Hello! My name is Sarah. What's your name?
**Person B:** Hi Sarah! I'm John. Nice to meet you.
**Person A:** Nice to meet you too, John!`,
    duration: "15 min",
    isDefault: true,
  },
  {
    id: "lesson-3",
    title: "Numbers 1-100",
    category: "Vocabulary",
    level: "Beginner",
    description: "Master counting from 1 to 100 in English",
    content: `# Numbers 1-100

## Numbers 1-10
1 - one, 2 - two, 3 - three, 4 - four, 5 - five
6 - six, 7 - seven, 8 - eight, 9 - nine, 10 - ten

## Numbers 11-20
11 - eleven, 12 - twelve, 13 - thirteen, 14 - fourteen, 15 - fifteen
16 - sixteen, 17 - seventeen, 18 - eighteen, 19 - nineteen, 20 - twenty

## Tens
30 - thirty, 40 - forty, 50 - fifty, 60 - sixty, 70 - seventy
80 - eighty, 90 - ninety, 100 - one hundred

## Practice
- 25 = twenty-five
- 47 = forty-seven
- 83 = eighty-three
- 99 = ninety-nine`,
    duration: "15 min",
    isDefault: true,
  },
  {
    id: "lesson-4",
    title: "Colors in English",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn the names of different colors in English",
    content: `# Colors in English

## Basic Colors
- **Red** - like a rose
- **Blue** - like the sky
- **Yellow** - like the sun
- **Green** - like grass
- **Orange** - like an orange fruit
- **Purple** - like grapes
- **Pink** - like a flamingo
- **Brown** - like chocolate
- **Black** - like night
- **White** - like snow
- **Gray** - like clouds

## Using Colors
- The sky is **blue**
- The grass is **green**
- The sun is **yellow**
- My car is **red**

## Practice
Describe things around you using colors:
- My book is ______
- The door is ______
- My shirt is ______`,
    duration: "12 min",
    isDefault: true,
  },
  {
    id: "lesson-5",
    title: "Days of the Week and Months",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn the days of the week and months of the year",
    content: `# Days of the Week and Months

## Days of the Week
1. **Monday** - first working day
2. **Tuesday**
3. **Wednesday** - middle of the week
4. **Thursday**
5. **Friday** - last working day
6. **Saturday** - weekend
7. **Sunday** - weekend

## Months of the Year
1. **January** - 31 days
2. **February** - 28/29 days
3. **March** - 31 days
4. **April** - 30 days
5. **May** - 31 days
6. **June** - 30 days
7. **July** - 31 days
8. **August** - 31 days
9. **September** - 30 days
10. **October** - 31 days
11. **November** - 30 days
12. **December** - 31 days

## Useful Phrases
- Today is Monday
- My birthday is in May
- The weekend is Saturday and Sunday`,
    duration: "20 min",
    isDefault: true,
  },
  {
    id: "lesson-6",
    title: "Family Members",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn vocabulary for family relationships",
    content: `# Family Members

## Immediate Family
- **Father** / **Dad** - male parent
- **Mother** / **Mom** - female parent
- **Brother** - male sibling
- **Sister** - female sibling
- **Son** - male child
- **Daughter** - female child

## Extended Family
- **Grandfather** / **Grandpa** - father's or mother's father
- **Grandmother** / **Grandma** - father's or mother's mother
- **Uncle** - parent's brother
- **Aunt** - parent's sister
- **Cousin** - uncle's or aunt's child
- **Nephew** - brother's or sister's son
- **Niece** - brother's or sister's daughter

## Practice Sentences
- My **father** works in a bank
- I have two **brothers** and one **sister**
- My **grandmother** lives with us
- Do you have any **cousins**?`,
    duration: "18 min",
    isDefault: true,
  },
  {
    id: "lesson-7",
    title: "Food and Drinks",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn common food and drink vocabulary",
    content: `# Food and Drinks

## Common Foods
- **Bread** - baked food
- **Rice** - grain
- **Meat** - from animals
- **Fish** - from water
- **Vegetables** - healthy plants
- **Fruits** - sweet and healthy
- **Eggs** - from chickens
- **Cheese** - from milk

## Common Drinks
- **Water** - most important
- **Milk** - from cows
- **Tea** - hot drink
- **Coffee** - morning drink
- **Juice** - from fruits
- **Soda** - sweet drink

## Meals
- **Breakfast** - morning meal
- **Lunch** - afternoon meal
- **Dinner** - evening meal
- **Snack** - small meal between meals

## Restaurant Phrases
- I would like some water, please
- Can I have the menu?
- I'll have a coffee, please
- The food is delicious!`,
    duration: "20 min",
    isDefault: true,
  },
  {
    id: "lesson-8",
    title: "Animals",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn names of common animals in English",
    content: `# Animals

## Pets
- **Dog** - man's best friend
- **Cat** - independent pet
- **Fish** - lives in water
- **Bird** - can fly
- **Rabbit** - has long ears
- **Hamster** - small rodent

## Farm Animals
- **Cow** - gives milk
- **Pig** - says "oink"
- **Chicken** - lays eggs
- **Horse** - can ride
- **Sheep** - gives wool
- **Goat** - eats everything

## Wild Animals
- **Lion** - king of jungle
- **Tiger** - big cat
- **Elephant** - largest land animal
- **Monkey** - lives in trees
- **Bear** - loves honey
- **Wolf** - like a wild dog

## Practice
- A **dog** barks
- A **cat** meows
- A **cow** moos
- A **bird** chirps`,
    duration: "18 min",
    isDefault: true,
  },
  {
    id: "lesson-9",
    title: "Common Verbs",
    category: "Grammar",
    level: "Beginner",
    description: "Learn essential action verbs in English",
    content: `# Common Verbs

## Daily Actions
- **Go** - I go to school
- **Come** - Come here, please
- **Eat** - I eat breakfast
- **Drink** - I drink water
- **Sleep** - I sleep at night
- **Wake up** - I wake up at 7 AM
- **Work** - My father works
- **Study** - I study English

## Communication Verbs
- **Say** - Say hello
- **Tell** - Tell me a story
- **Speak** - I speak English
- **Talk** - Let's talk
- **Ask** - Ask a question
- **Answer** - Answer the question

## Movement Verbs
- **Walk** - I walk to school
- **Run** - Children run fast
- **Jump** - Jump high
- **Sit** - Please sit down
- **Stand** - Stand up, please
- **Open** - Open the door
- **Close** - Close the window

## Practice Sentences
- I **eat** an apple every day
- She **walks** to work
- They **study** English
- We **drink** coffee in the morning`,
    duration: "25 min",
    isDefault: true,
  },
  {
    id: "lesson-10",
    title: "Asking Questions",
    category: "Grammar",
    level: "Beginner",
    description: "Learn how to ask and answer basic questions",
    content: `# Asking Questions

## Question Words
- **What** - asking about things (What is this?)
- **Who** - asking about people (Who are you?)
- **Where** - asking about places (Where is the school?)
- **When** - asking about time (When is your birthday?)
- **Why** - asking for reasons (Why are you late?)
- **How** - asking about manner (How are you?)

## Yes/No Questions
- Are you a student? → Yes, I am / No, I'm not
- Do you like pizza? → Yes, I do / No, I don't
- Can you swim? → Yes, I can / No, I can't
- Is this your book? → Yes, it is / No, it isn't

## WH Questions
- **What** is your name? → My name is John
- **Where** do you live? → I live in London
- **When** is your birthday? → My birthday is in May
- **Why** are you happy? → Because it's Friday!
- **How** old are you? → I am 20 years old

## Practice
Ask and answer:
1. What is your favorite color?
2. Where are you from?
3. When do you wake up?
4. Do you speak English?`,
    duration: "25 min",
    isDefault: true,
  },
  {
    id: "lesson-11",
    title: "Present Simple Tense",
    category: "Grammar",
    level: "Beginner",
    description: "Master the present simple tense for daily routines and facts",
    content: `# Present Simple Tense

## When to Use
- **Daily routines**: I wake up at 7 AM every day
- **Facts**: The sun rises in the east
- **Habits**: She drinks coffee every morning
- **General truths**: Water boils at 100°C

## Positive Form
- **I/You/We/They** + verb
  - I work, You study, We live, They play
- **He/She/It** + verb + **s/es**
  - He works, She studies, It rains

## Negative Form
- **I/You/We/They** + **do not (don't)** + verb
  - I don't work, They don't study
- **He/She/It** + **does not (doesn't)** + verb
  - He doesn't work, She doesn't study

## Question Form
- **Do** + I/you/we/they + verb?
  - Do you work? Do they study?
- **Does** + he/she/it + verb?
  - Does he work? Does she study?

## Time Expressions
- **Every day/week/month/year**
- **Always, usually, often, sometimes, rarely, never**
- **On Mondays, at weekends, in the morning**

## Practice Examples
✓ I **play** tennis every weekend
✓ She **goes** to school by bus
✓ We **don't eat** meat
✓ **Does** he **speak** French?
✓ They **always wake** up early`,
    duration: "30 min",
    isDefault: true,
  },
  {
    id: "lesson-12",
    title: "Common Phrases for Shopping",
    category: "Speaking",
    level: "Beginner",
    description: "Essential phrases for shopping and making purchases",
    content: `# Common Phrases for Shopping

## Asking for Items
- "Do you have...?" → Do you have this in blue?
- "Where can I find...?" → Where can I find shoes?
- "I'm looking for..." → I'm looking for a dress
- "Can I see...?" → Can I see that shirt?

## Asking About Price
- **How much is this?** → It's $20
- **How much does it cost?** → It costs $50
- **What's the price?** → The price is $30
- **Is it on sale?** → Yes, 20% off

## Trying Things
- **Can I try this on?** → Yes, the fitting room is there
- **Do you have this in a different size?**
  - Small (S), Medium (M), Large (L), Extra Large (XL)
- **Do you have this in another color?**

## Making a Purchase
- **I'll take it** → Okay, that's $25
- **I'll buy this** → Cash or card?
- **Can I pay by card?** → Yes, of course
- **Do you accept credit cards?** → Yes, we do

## If You're Just Looking
- "I'm just looking, thanks"
- "I'm just browsing"
- "I'll let you know if I need help"

## Returning Items
- "I'd like to return this"
- "Can I get a refund?"
- "This doesn't fit"
- "Do you have the receipt?"

## Practice Dialogue
**Customer:** Hi, how much is this jacket?
**Seller:** It's $80, but it's on sale for $60.
**Customer:** Great! Do you have it in medium?
**Seller:** Yes, here you are.
**Customer:** Can I try it on?
**Seller:** Of course! The fitting room is over there.
**Customer:** Perfect, I'll take it!`,
    duration: "20 min",
    isDefault: true,
  },
  {
    id: "lesson-13",
    title: "Telling Time in English",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn how to ask and tell the time correctly",
    content: `# Telling Time in English

## Asking for Time
- **What time is it?**
- **Do you have the time?**
- **Could you tell me the time, please?**

## O'clock (Exact Hours)
- **1:00** → It's one o'clock
- **7:00** → It's seven o'clock
- **12:00** → It's twelve o'clock (noon/midnight)

## Minutes Past the Hour
- **3:05** → It's five past three
- **3:10** → It's ten past three
- **3:15** → It's a quarter past three / fifteen past three
- **3:30** → It's half past three / thirty past three

## Minutes To the Hour
- **3:35** → It's twenty-five to four
- **3:45** → It's a quarter to four / fifteen to four
- **3:50** → It's ten to four
- **3:55** → It's five to four

## Digital Format (More Common)
- **3:15** → It's three fifteen
- **8:30** → It's eight thirty
- **11:45** → It's eleven forty-five

## AM and PM
- **AM** → Morning (midnight to noon)
  - 8:00 AM = 8 in the morning
- **PM** → Afternoon/Evening (noon to midnight)
  - 3:00 PM = 3 in the afternoon
  - 8:00 PM = 8 in the evening

## Time Expressions
- **In the morning** (6 AM - 12 PM)
- **In the afternoon** (12 PM - 6 PM)
- **In the evening** (6 PM - 9 PM)
- **At night** (9 PM - 6 AM)
- **At noon** (12:00 PM)
- **At midnight** (12:00 AM)

## Practice
What time is it?
- 2:00 → __________
- 4:15 → __________
- 6:30 → __________
- 9:45 → __________`,
    duration: "22 min",
    isDefault: true,
  },
  {
    id: "lesson-14",
    title: "Weather Vocabulary",
    category: "Vocabulary",
    level: "Beginner",
    description: "Learn to describe weather conditions and seasons",
    content: `# Weather Vocabulary

## Basic Weather Conditions
- **Sunny** ☀️ → The sun is shining
- **Cloudy** ☁️ → There are many clouds
- **Rainy** 🌧️ → It is raining
- **Snowy** ❄️ → It is snowing
- **Windy** 💨 → The wind is blowing
- **Foggy** 🌫️ → There is fog
- **Stormy** ⛈️ → There is a storm

## Temperature
- **Hot** 🔥 → Very warm (35°C+)
- **Warm** → Pleasant temperature (20-30°C)
- **Cool** → A bit cold (10-20°C)
- **Cold** ❄️ → Very low temperature (0-10°C)
- **Freezing** → Below 0°C

## Asking About Weather
- **What's the weather like?**
  → It's sunny and warm
- **How's the weather today?**
  → It's raining
- **Is it going to rain?**
  → Yes, probably
- **What's the temperature?**
  → It's 25 degrees

## Four Seasons
1. **Spring** (March-May) 🌸
   - Warm, flowers bloom, rain
   - "Spring is my favorite season"

2. **Summer** (June-August) ☀️
   - Hot, sunny, perfect for beach
   - "Summer is the hottest season"

3. **Autumn/Fall** (September-November) 🍂
   - Cool, leaves fall, colorful
   - "Autumn is beautiful with orange leaves"

4. **Winter** (December-February) ❄️
   - Cold, snow, short days
   - "Winter is the coldest season"

## Useful Phrases
- "It's a beautiful day!"
- "What terrible weather!"
- "I love sunny days"
- "I don't like rainy weather"
- "It's getting colder"
- "The weather is changing"

## Practice Dialogue
**A:** What's the weather like today?
**B:** It's sunny and warm. Perfect weather!
**A:** Great! Let's go to the park.
**B:** Good idea! But take a jacket, it might get cool later.`,
    duration: "20 min",
    isDefault: true,
  },
  {
    id: "lesson-15",
    title: "At the Restaurant",
    category: "Speaking",
    level: "Beginner",
    description: "Essential phrases for dining out and ordering food",
    content: `# At the Restaurant

## Making a Reservation
- "I'd like to make a reservation for 2 people"
- "Do you have a table for 4 at 7 PM?"
- "I have a reservation under the name Smith"

## Arriving at Restaurant
- **Host:** "Good evening! Do you have a reservation?"
- **You:** "Yes, for 2 people under Smith"
- **Host:** "Right this way, please"

## Ordering Food
### Starting
- "Can I see the menu, please?"
- "What do you recommend?"
- "What's the special today?"
- "I'm ready to order"

### Placing Order
- "I'll have the..." → I'll have the steak
- "I'd like..." → I'd like the fish
- "Can I get..." → Can I get a salad?
- "For me, please" → The pasta for me, please

### Asking Questions
- "Does this come with...?" → Does this come with rice?
- "Is this spicy?" → Is this dish spicy?
- "What's in this?" → What's in the soup?
- "How is it cooked?" → How is the salmon cooked?

## Dietary Requirements
- "I'm vegetarian" / "I don't eat meat"
- "I'm allergic to nuts"
- "Do you have gluten-free options?"
- "I'm vegan" (no animal products)

## During the Meal
- "This is delicious!"
- "Could I have some more water, please?"
- "Excuse me, I didn't order this"
- "Could you bring me a fork/knife/spoon?"

## Asking for the Bill
- "Can I have the bill, please?" (UK)
- "Can I have the check, please?" (US)
- "We'd like to pay, please"

## Paying
- "Can we split the bill?" (everyone pays separately)
- "I'll pay" (you pay for everyone)
- "Let's go Dutch" (split equally)
- "Do you accept credit cards?"

## Complete Restaurant Dialogue
**Waiter:** Good evening! Table for two?
**Customer:** Yes, please. By the window if possible.
**Waiter:** Of course. Here's the menu.
**Customer:** Thank you. What do you recommend?
**Waiter:** The grilled salmon is excellent today.
**Customer:** Great! I'll have that with vegetables.
**Waiter:** And to drink?
**Customer:** Water, please.
[After eating]
**Customer:** That was delicious! Can I have the bill?
**Waiter:** Certainly. Here you are.
**Customer:** Do you accept cards?
**Waiter:** Yes, we do.`,
    duration: "25 min",
    isDefault: true,
  },
  {
    id: "lesson-16",
    title: "Directions and Locations",
    category: "Speaking",
    level: "Beginner",
    description: "Learn to ask for and give directions",
    content: `# Directions and Locations

## Asking for Directions
- **"Excuse me, where is...?"**
  → Excuse me, where is the bank?
- **"How do I get to...?"**
  → How do I get to the train station?
- **"Can you tell me the way to...?"**
  → Can you tell me the way to the museum?
- **"I'm looking for..."**
  → I'm looking for the post office

## Giving Directions
### Basic Instructions
- **Go straight** → Continue in this direction
- **Turn left** → Make a left turn
- **Turn right** → Make a right turn
- **Go back** → Return the way you came
- **Cross the street** → Walk to the other side

### Using Landmarks
- "It's **next to** the bank" (beside)
- "It's **opposite** the park" (across from)
- "It's **between** the café and the shop"
- "It's **on the corner** of Main Street"
- "It's **in front of** the library"
- "It's **behind** the church"

### Distance
- "It's **near here**" → very close
- "It's **far from here**" → not close
- "It's **5 minutes away**" → walking time
- "It's **about 2 kilometers**"

### Ordinal Numbers for Directions
- "Take the **first** street on the left"
- "Turn at the **second** traffic light"
- "It's the **third** building on the right"

## Prepositions of Place
- **On** → The book is on the table
- **In** → She is in the room
- **At** → Meet me at the station
- **Next to** → Sit next to me
- **Between** → Between the bank and café
- **Opposite** → Opposite the park
- **Behind** → Behind the building
- **In front of** → In front of the store

## Transportation Questions
- "Where is the bus stop?"
- "How can I get to the airport?"
- "Is there a subway station nearby?"
- "Which bus goes to downtown?"

## Complete Direction Dialogue
**Tourist:** Excuse me, how do I get to the museum?
**Local:** Go straight for 2 blocks, then turn left.
**Tourist:** Turn left where?
**Local:** At the traffic light. The museum is on your right, next to the café.
**Tourist:** Is it far?
**Local:** No, about 5 minutes on foot.
**Tourist:** Thank you so much!
**Local:** You're welcome! Have a nice day.

## Practice
Give directions to these places:
1. School → __________
2. Hospital → __________
3. Your home → __________`,
    duration: "25 min",
    isDefault: true,
  },
  {
    id: "lesson-17",
    title: "Hobbies and Free Time",
    category: "Speaking",
    level: "Beginner",
    description: "Talk about your hobbies and leisure activities",
    content: `# Hobbies and Free Time

## Common Hobbies
### Sports & Exercise
- **Playing** sports (football, basketball, tennis)
- **Going** swimming / running / cycling
- **Doing** yoga / gymnastics
- **Working out** at the gym

### Creative Activities
- **Playing** music / guitar / piano
- **Drawing** and **painting**
- **Writing** stories / poems
- **Taking** photos (photography)
- **Making** crafts

### Indoor Activities
- **Reading** books / magazines
- **Watching** movies / TV shows
- **Playing** video games
- **Cooking** and **baking**
- **Listening to** music

### Outdoor Activities
- **Going** hiking / camping
- **Gardening**
- **Fishing**
- **Bird watching**

### Social Activities
- **Meeting** friends
- **Going out** with friends
- **Dancing**
- **Traveling**

## Talking About Hobbies
### Asking Questions
- "What do you do in your free time?"
- "What are your hobbies?"
- "Do you have any hobbies?"
- "What do you like doing?"

### Answering
- "I like..." → I like reading
- "I love..." → I love playing football
- "I enjoy..." → I enjoy cooking
- "My hobby is..." → My hobby is photography
- "In my free time, I..." → In my free time, I play guitar

## Frequency Adverbs
- **Always** (100%) → I always read before bed
- **Usually** (80%) → I usually go swimming on Saturdays
- **Often** (60%) → I often watch movies
- **Sometimes** (40%) → I sometimes play tennis
- **Rarely** (20%) → I rarely cook
- **Never** (0%) → I never go camping

## Useful Phrases
- "I'm interested in..." → I'm interested in art
- "I'm good at..." → I'm good at playing chess
- "I'm not very good at..." → I'm not very good at singing
- "I want to learn..." → I want to learn how to dance
- "I used to..." → I used to play football (past hobby)

## Expressing Likes and Dislikes
### Positive
- "I love playing basketball!"
- "I really enjoy reading"
- "I'm crazy about photography"
- "I'm a big fan of cycling"

### Negative
- "I don't like running"
- "I'm not interested in video games"
- "I hate cooking"
- "I'm not a fan of fishing"

## Practice Dialogue
**A:** What do you do in your free time?
**B:** I love reading and playing guitar. What about you?
**A:** I enjoy playing football and watching movies.
**B:** How often do you play football?
**A:** Usually twice a week. Do you play any sports?
**B:** Not really. I prefer creative hobbies like painting.
**A:** That's cool! I'd love to learn painting someday.

## Your Turn
Write about your hobbies:
1. My favorite hobby is __________
2. I enjoy __________
3. In my free time, I __________
4. I want to learn __________`,
    duration: "25 min",
    isDefault: true,
  },
];

function LessonsModule({ isAdmin }) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState(defaultLessons);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_URL}/lessons`);
      if (response.ok) {
        const data = await response.json();
        // Combine default lessons with custom lessons
        setLessons([...defaultLessons, ...data.lessons]);
      } else {
        // If API fails, use default lessons
        setLessons(defaultLessons);
      }
    } catch (error) {
      console.log("Using default lessons");
      setLessons(defaultLessons);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All" || lesson.level === selectedLevel;
    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = ["All", ...new Set(lessons.map((l) => l.category))];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all shadow-md border border-gray-200"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 text-gray-900">
            English Lessons
          </h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin-panel")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400 shadow-sm hover:border-gray-300"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all cursor-pointer shadow-sm hover:border-gray-300"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? "All Levels" : level}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all cursor-pointer shadow-sm hover:border-gray-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lessons Grid */}
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading lessons...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaBook className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLevel("All");
                setSelectedCategory("All");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-400 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md">
                    <FaBook className="text-xl text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                      lesson.level === "Beginner"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : lesson.level === "Intermediate"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        : "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                    }`}
                  >
                    {lesson.level}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                    <FaGraduationCap className="text-indigo-600" />
                    {lesson.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                    <FaClock className="text-blue-600" />
                    {lesson.duration}
                  </span>
                </div>

                {/* Action */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="w-full text-center text-sm font-bold text-blue-600 group-hover:text-indigo-600 transition-colors">
                    Start Lesson →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonsModule;
