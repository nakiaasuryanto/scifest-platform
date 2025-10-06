import { supabase } from '../lib/supabase'

const sampleQuestions = [
  // Subtest 1: Penalaran Umum (5 sample questions)
  {
    subtest_id: 1,
    question_text: 'Semua burung dapat terbang. Pinguin adalah burung. Kesimpulan yang tepat adalah:',
    options: ["Pinguin dapat terbang", "Pinguin tidak dapat terbang", "Semua burung kecuali pinguin dapat terbang", "Pernyataan pertama salah"],
    correct_answer: 3,
    correct_answer_text: "Pernyataan pertama salah"
  },
  {
    subtest_id: 1,
    question_text: 'Jika A > B dan B > C, maka:',
    options: ["A = C", "A < C", "A > C", "A ≤ C"],
    correct_answer: 2,
    correct_answer_text: "A > C"
  },
  {
    subtest_id: 1,
    question_text: 'Dalam sebuah kelas, semua siswa yang rajin mendapat nilai bagus. Budi mendapat nilai bagus. Dapat disimpulkan:',
    options: ["Budi adalah siswa yang rajin", "Budi mungkin siswa yang rajin", "Budi bukan siswa yang rajin", "Tidak dapat disimpulkan"],
    correct_answer: 3
  },
  {
    subtest_id: 1,
    question_text: 'Manakah yang melanjutkan pola: 2, 6, 12, 20, 30, ?',
    options: ["40", "42", "44", "46"],
    correct_answer: 1
  },
  {
    subtest_id: 1,
    question_text: 'Jika semua dokter adalah sarjana dan semua sarjana adalah lulusan universitas, maka:',
    options: ["Semua lulusan universitas adalah dokter", "Semua dokter adalah lulusan universitas", "Tidak ada dokter yang bukan sarjana", "B dan C benar"],
    correct_answer: 3
  },

  // Subtest 2: Pengetahuan dan Pemahaman Umum (3 sample questions)
  {
    subtest_id: 2,
    question_text: 'Ibu kota Indonesia adalah:',
    options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
    correct_answer: 0
  },
  {
    subtest_id: 2,
    question_text: 'Proklamasi kemerdekaan Indonesia dibacakan pada tanggal:',
    options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"],
    correct_answer: 1
  },
  {
    subtest_id: 2,
    question_text: 'Planet terdekat dengan matahari adalah:',
    options: ["Venus", "Mars", "Merkurius", "Bumi"],
    correct_answer: 2
  },

  // Subtest 3: Pemahaman Bacaan dan Menulis (3 sample questions)
  {
    subtest_id: 3,
    question_text: 'Manakah kalimat yang menggunakan ejaan yang benar?',
    options: ["Dia datang ke rumah saya kemarin", "Dia datang kerumah saya kemarin", "Dia datang ke-rumah saya kemarin", "Dia datang ke rumahsaya kemarin"],
    correct_answer: 0
  },
  {
    subtest_id: 3,
    question_text: 'Ide pokok paragraf biasanya terdapat pada:',
    options: ["Kalimat pertama", "Kalimat tengah", "Kalimat terakhir", "Semua jawaban benar"],
    correct_answer: 3
  },
  {
    subtest_id: 3,
    question_text: 'Kata baku dari "praktek" adalah:',
    options: ["praktek", "praktik", "praktekk", "praktiek"],
    correct_answer: 1
  },

  // Subtest 4: Pengetahuan Kuantitatif (3 sample questions)
  {
    subtest_id: 4,
    question_text: 'Hasil dari 2³ + 3² adalah:',
    options: ["15", "17", "19", "21"],
    correct_answer: 1
  },
  {
    subtest_id: 4,
    question_text: 'Jika x + 5 = 12, maka nilai x adalah:',
    options: ["5", "6", "7", "8"],
    correct_answer: 2
  },
  {
    subtest_id: 4,
    question_text: 'Persentase dari 25/100 adalah:',
    options: ["20%", "25%", "30%", "35%"],
    correct_answer: 1
  },

  // Subtest 5: Literasi Bahasa Indonesia (3 sample questions)
  {
    subtest_id: 5,
    question_text: 'Sinonim dari kata "rajin" adalah:',
    options: ["malas", "giat", "lelah", "senang"],
    correct_answer: 1
  },
  {
    subtest_id: 5,
    question_text: 'Antonim dari kata "terang" adalah:',
    options: ["cahaya", "sinar", "gelap", "bening"],
    correct_answer: 2
  },
  {
    subtest_id: 5,
    question_text: 'Kalimat tanya yang benar adalah:',
    options: ["Kapan kamu pergi", "Kapan kamu pergi?", "Kapan kamu pergi.", "Kapan kamu pergi!"],
    correct_answer: 1
  },

  // Subtest 6: Literasi Bahasa Inggris (3 sample questions)
  {
    subtest_id: 6,
    question_text: 'Choose the correct sentence:',
    options: ["She go to school everyday", "She goes to school everyday", "She going to school everyday", "She gone to school everyday"],
    correct_answer: 1
  },
  {
    subtest_id: 6,
    question_text: 'What is the past tense of "run"?',
    options: ["runned", "ran", "runed", "running"],
    correct_answer: 1
  },
  {
    subtest_id: 6,
    question_text: 'Choose the correct plural form of "child":',
    options: ["childs", "childes", "children", "childrens"],
    correct_answer: 2
  },

  // Subtest 7: Penalaran Matematika (3 sample questions)
  {
    subtest_id: 7,
    question_text: 'Jika 2x + 3 = 11, maka nilai x adalah:',
    options: ["3", "4", "5", "6"],
    correct_answer: 1
  },
  {
    subtest_id: 7,
    question_text: 'Luas persegi dengan sisi 8 cm adalah:',
    options: ["32 cm²", "64 cm²", "16 cm²", "48 cm²"],
    correct_answer: 1
  },
  {
    subtest_id: 7,
    question_text: 'Hasil dari √16 + √25 adalah:',
    options: ["7", "8", "9", "10"],
    correct_answer: 2
  }
]

export async function addSampleQuestions() {
  try {
    console.log('🔍 Checking for existing questions...')

    // First check if questions already exist
    const { data: existingQuestions, error: checkError } = await supabase
      .from('questions')
      .select('*')
      .limit(5)

    if (checkError) {
      console.error('❌ Error checking existing questions:', checkError)
      return { success: false, error: checkError }
    }

    console.log('📊 Found', existingQuestions?.length || 0, 'existing questions')

    if (existingQuestions && existingQuestions.length >= sampleQuestions.length) {
      console.log('✅ Sufficient questions already exist in database')
      return { success: true, message: 'Questions already exist' }
    }

    console.log('📝 Adding sample questions...')

    // Add the sample questions
    const { data, error } = await supabase
      .from('questions')
      .insert(sampleQuestions)

    if (error) {
      console.error('❌ Error inserting questions:', error)
      return { success: false, error }
    }

    console.log('✅ Successfully added', sampleQuestions.length, 'sample questions')
    return { success: true, data, count: sampleQuestions.length }

  } catch (error) {
    console.error('💥 Error:', error)
    return { success: false, error }
  }
}