import { ExamData } from '../types/exam'

export const examData: ExamData = {
  subtests: [
    {
      id: 1,
      name: "Tes Potensi Skolastik - Penalaran Umum",
      duration: 20,
      questions: [
        {
          id: 1,
          question: "Semua burung dapat terbang. Pinguin adalah burung. Kesimpulan yang tepat adalah:",
          options: [
            "Pinguin dapat terbang",
            "Pinguin tidak dapat terbang",
            "Semua burung kecuali pinguin dapat terbang",
            "Pernyataan pertama salah"
          ],
          correctAnswer: 3
        },
        {
          id: 2,
          question: "Jika A > B dan B > C, maka:",
          options: [
            "A = C",
            "A < C",
            "A > C",
            "A ≤ C"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Dalam sebuah kelas, semua siswa yang rajin mendapat nilai bagus. Budi mendapat nilai bagus. Dapat disimpulkan:",
          options: [
            "Budi adalah siswa yang rajin",
            "Budi mungkin siswa yang rajin",
            "Budi bukan siswa yang rajin",
            "Tidak dapat disimpulkan"
          ],
          correctAnswer: 3
        },
        {
          id: 4,
          question: "Manakah yang melanjutkan pola: 2, 6, 12, 20, 30, ?",
          options: [
            "40",
            "42",
            "44",
            "46"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 2,
      name: "Tes Potensi Skolastik - Pengetahuan Kuantitatif",
      duration: 15,
      questions: [
        {
          id: 1,
          question: "Hasil dari 2³ + 3² adalah:",
          options: [
            "15",
            "17",
            "19",
            "21"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Jika x + 5 = 12, maka nilai x adalah:",
          options: [
            "5",
            "6",
            "7",
            "8"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 3,
      name: "Literasi Bahasa Indonesia",
      duration: 25,
      questions: [
        {
          id: 1,
          question: "Manakah kalimat yang menggunakan ejaan yang benar?",
          options: [
            "Dia datang ke rumah saya kemarin",
            "Dia datang kerumah saya kemarin",
            "Dia datang ke-rumah saya kemarin",
            "Dia datang ke rumahsaya kemarin"
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 4,
      name: "Literasi Bahasa Inggris",
      duration: 20,
      questions: [
        {
          id: 1,
          question: "Choose the correct sentence:",
          options: [
            "She go to school everyday",
            "She goes to school everyday",
            "She going to school everyday",
            "She gone to school everyday"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 5,
      name: "Pengetahuan Umum",
      duration: 15,
      questions: [
        {
          id: 1,
          question: "Ibu kota Indonesia adalah:",
          options: [
            "Jakarta",
            "Surabaya",
            "Bandung",
            "Medan"
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 6,
      name: "Matematika Dasar",
      duration: 30,
      questions: [
        {
          id: 1,
          question: "Turunan dari f(x) = x² + 3x - 5 adalah:",
          options: [
            "2x + 3",
            "x² + 3",
            "2x - 5",
            "x + 3"
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 7,
      name: "Fisika",
      duration: 25,
      questions: [
        {
          id: 1,
          question: "Hukum Newton I menyatakan:",
          options: [
            "F = ma",
            "Benda diam akan tetap diam jika tidak ada gaya yang bekerja",
            "Aksi = Reaksi",
            "Momentum kekal"
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 8,
      name: "Kimia",
      duration: 20,
      questions: [
        {
          id: 1,
          question: "Rumus kimia air adalah:",
          options: [
            "H₂O",
            "HO₂",
            "H₃O",
            "H₂O₂"
          ],
          correctAnswer: 0
        }
      ]
    },
    {
      id: 9,
      name: "Biologi",
      duration: 20,
      questions: [
        {
          id: 1,
          question: "Organel sel yang berfungsi sebagai pusat kontrol sel adalah:",
          options: [
            "Mitokondria",
            "Ribosom",
            "Nukleus",
            "Lisosom"
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
}