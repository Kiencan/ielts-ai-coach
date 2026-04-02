import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Listening question sets
  await prisma.questionSet.createMany({
    data: [
      {
        skill: "listening",
        type: "form_completion",
        difficulty: "easy",
        title: "Accommodation Enquiry",
        estimatedBand: 5.5,
        content: {
          sections: [{
            section_number: 1,
            questions: [
              { id: "q1", type: "form_completion", label: "Tên người thuê:", answer: "Johnson", marks: 1 },
              { id: "q2", type: "form_completion", label: "Số điện thoại:", answer: "0912345678", marks: 1 },
              { id: "q3", type: "form_completion", label: "Loại phòng:", answer: "single", marks: 1 },
              { id: "q4", type: "multiple_choice", label: "Trang thiết bị:", answer: "B", options: [{ value: "A", text: "Bãi đỗ xe" }, { value: "B", text: "Máy giặt" }, { value: "C", text: "Ban công" }], marks: 1 },
              { id: "q5", type: "multiple_choice", label: "Giá thuê:", answer: "C", options: [{ value: "A", text: "< 3 triệu" }, { value: "B", text: "3–5 triệu" }, { value: "C", text: "5–7 triệu" }], marks: 1 },
            ]
          }]
        }
      },
      {
        skill: "listening",
        type: "multiple_choice",
        difficulty: "medium",
        title: "City Tour Information",
        estimatedBand: 6.5,
        content: {
          sections: [{
            section_number: 2,
            questions: [
              { id: "q1", type: "multiple_choice", question: "What time does the morning tour start?", answer: "B", options: [{ value: "A", text: "8:00 AM" }, { value: "B", text: "9:00 AM" }, { value: "C", text: "10:00 AM" }], marks: 1 },
              { id: "q2", type: "form_completion", label: "Tour duration:", answer: "3 hours", marks: 1 },
            ]
          }]
        }
      }
    ],
    skipDuplicates: true,
  });

  // Reading question sets
  await prisma.questionSet.createMany({
    data: [
      {
        skill: "reading",
        type: "true_false_ng",
        difficulty: "medium",
        title: "The History of Coffee",
        estimatedBand: 6.5,
        content: {
          passage_title: "The History of Coffee",
          passage_text: "Coffee is one of the world's most popular beverages, consumed by billions of people every day. Its origins can be traced back to the ancient coffee forests of the Ethiopian plateau, where legend has it that the goat herder Kaldi first noticed the effects of these plants when his goats became so energetic after eating berries from a certain tree that they did not want to sleep at night.\n\nKaldi reportedly shared his discovery with the local monastery and the abbot made a drink with the berries. Finding that the drink kept him alert through the long hours of evening prayer, he shared his discovery with the other monks. Knowledge of the energizing berries spread eastward and coffee was first cultivated and traded in the Arabian Peninsula.\n\nBy the 15th century, coffee was being grown in the Yemeni district of Arabia and by the 16th century it was known in the rest of the Middle East, Persia, Turkey, and northern Africa. Coffee cultivation spread throughout the Americas in the 18th century, first to Haiti in 1720 and later to Brazil, which today produces approximately one-third of all coffee in the world.",
          questions: [
            { id: "q1", type: "true_false_ng", statement: "Coffee was first discovered in Ethiopia.", correct_answer: "TRUE", explanation: "Paragraph 1 states its origins trace to Ethiopian plateau.", marks: 1 },
            { id: "q2", type: "true_false_ng", statement: "Kaldi was a monk at a local monastery.", correct_answer: "FALSE", explanation: "Kaldi was a goat herder, not a monk.", marks: 1 },
            { id: "q3", type: "true_false_ng", statement: "The monks used coffee to stay awake during prayer.", correct_answer: "TRUE", explanation: "The drink kept the abbot alert through evening prayer.", marks: 1 },
            { id: "q4", type: "short_answer", question: "What percentage of world coffee does Brazil produce?", correct_answer: "one-third", explanation: "Paragraph 3: approximately one-third.", marks: 1 },
          ]
        }
      },
      {
        skill: "reading",
        type: "matching_headings",
        difficulty: "hard",
        title: "Climate Change and Agriculture",
        estimatedBand: 7.5,
        content: {
          passage_title: "Climate Change and Agriculture",
          passage_text: "Rising global temperatures are fundamentally altering agricultural systems worldwide. Scientists predict that by 2050, crop yields for staple foods such as wheat, rice, and maize could decline by up to 25% in many regions if no adaptation measures are taken.\n\nFarmers in developing nations are particularly vulnerable because they often lack the resources to adapt to changing conditions. Smallholder farmers, who produce 70% of the world's food, face the double burden of increased climate variability and limited access to improved seeds, fertilisers, and irrigation technology.\n\nHowever, agricultural innovation offers hope. Drought-resistant crop varieties, precision farming technologies, and improved water management systems are being deployed across the globe. Countries like Israel have demonstrated that water-scarce regions can maintain high agricultural productivity through drip irrigation and advanced greenhouse techniques.",
          questions: [
            { id: "q1", type: "true_false_ng", statement: "Crop yields are predicted to increase by 2050 without intervention.", correct_answer: "FALSE", explanation: "The text says yields could decline by up to 25%.", marks: 1 },
            { id: "q2", type: "true_false_ng", statement: "Smallholder farmers produce the majority of the world's food.", correct_answer: "TRUE", explanation: "Paragraph 2: they produce 70% of world's food.", marks: 1 },
            { id: "q3", type: "short_answer", question: "Name ONE technology used in drought-prone areas according to the passage.", correct_answer: "drip irrigation", explanation: "Paragraph 3 mentions drip irrigation.", marks: 1 },
          ]
        }
      }
    ],
    skipDuplicates: true,
  });

  // Writing question sets
  await prisma.questionSet.createMany({
    data: [
      {
        skill: "writing",
        type: "task2_opinion",
        difficulty: "medium",
        title: "Technology reduces human interaction",
        estimatedBand: 6.5,
        content: {
          task: 2,
          type: "opinion",
          prompt: "Some people believe that modern technology has reduced face-to-face communication and weakened human relationships. To what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
          min_words: 250,
          time_limit_minutes: 40,
        }
      },
      {
        skill: "writing",
        type: "task1_bar_chart",
        difficulty: "medium",
        title: "Tourism Statistics 2020–2024",
        estimatedBand: 6.0,
        content: {
          task: 1,
          type: "bar_chart",
          prompt: "The bar chart below shows the number of international tourists visiting five Southeast Asian countries between 2020 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          min_words: 150,
          time_limit_minutes: 20,
        }
      },
      {
        skill: "writing",
        type: "task2_discussion",
        difficulty: "easy",
        title: "City vs countryside living",
        estimatedBand: 6.0,
        content: {
          task: 2,
          type: "discussion",
          prompt: "Some people prefer to live in cities, while others choose to live in rural areas. Discuss both views and give your own opinion.\n\nWrite at least 250 words.",
          min_words: 250,
          time_limit_minutes: 40,
        }
      }
    ],
    skipDuplicates: true,
  });

  // Speaking question sets
  await prisma.questionSet.createMany({
    data: [
      {
        skill: "speaking",
        type: "part1",
        difficulty: "easy",
        title: "Hometown & Daily Life",
        estimatedBand: 6.0,
        content: {
          part: 1,
          questions: [
            "Where are you from originally?",
            "What do you like most about your hometown?",
            "How do you usually spend your weekends?",
            "Do you prefer to stay at home or go out in your free time? Why?",
            "What type of music do you enjoy listening to?",
          ]
        }
      },
      {
        skill: "speaking",
        type: "part2",
        difficulty: "medium",
        title: "Describe a memorable trip",
        estimatedBand: 6.5,
        content: {
          part: 2,
          cue_card: {
            topic: "Describe a memorable trip you have taken.",
            prompts: ["where you went", "who you went with", "what you did there", "why it was memorable"]
          },
          follow_up_questions: [
            "Do Vietnamese people travel a lot nowadays?",
            "How has tourism changed in Vietnam in the last decade?",
            "What are the advantages and disadvantages of international travel?",
          ]
        }
      }
    ],
    skipDuplicates: true,
  });

  // Sample vocabulary topic items
  await prisma.vocabularyItem.createMany({
    data: [
      // These are system-level topic words (no userId for now - would be per-user)
      // Just validate the schema works
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
