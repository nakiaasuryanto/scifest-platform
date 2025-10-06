import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import './ExamRules.css'
import { SupabaseService } from '../../services/supabaseService'

const ExamRules = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [hasCompletedExam, setHasCompletedExam] = useState(false)
  const navigate = useNavigate()

  const examRules = [
    "Ujian terdiri dari 7 subtest dengan durasi yang berbeda-beda",
    "Setiap subtest memiliki jumlah soal yang berbeda",
    "Waktu akan terus berjalan setelah ujian dimulai",
    "Jika waktu habis, ujian akan otomatis berakhir",
    "Jawaban yang sudah dipilih akan tersimpan otomatis",
    "Tombol 'Ragu-ragu' untuk menandai soal yang belum yakin",
    "Tidak dapat mengulang ujian setelah dimulai",
    "Pastikan koneksi internet stabil selama ujian",
    "Dilarang membuka aplikasi lain selama ujian"
  ]

  useEffect(() => {
    const checkExamStatus = async () => {
      const userId = localStorage.getItem('userId')
      if (userId) {
        const { data } = await SupabaseService.getStudentExamResults(userId)
        if (data && data.length > 0) {
          setHasCompletedExam(true)
        }
      }
    }
    checkExamStatus()
  }, [])

  const handleStartExam = () => {
    setShowConfirmModal(true)
  }

  const confirmStartExam = () => {
    setShowConfirmModal(false)
    navigate('/exam/1')
  }

  const handleViewDashboard = () => {
    navigate('/user-dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  return (
    <>
      <div className="top-logo-container">
        <img src={logo} alt="Logo" className="top-logo" />
      </div>
      <div className="exam-rules-container">
        <div className="exam-rules-card">
          <div className="header-section">
            <h1>Peraturan Ujian Try Out</h1>
            <div className="header-buttons">
              {hasCompletedExam && (
                <button className="dashboard-btn" onClick={handleViewDashboard}>
                  Lihat Hasil
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

        <div className="rules-content">
          <h3>Ketentuan Umum:</h3>
          <ul>
            {examRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="exam-info">
          <div className="info-item">
            <strong>Total Subtest:</strong> 7 Subtest
          </div>
          <div className="info-item">
            <strong>Format:</strong> Multiple Choice
          </div>
          <div className="info-item">
            <strong>Status:</strong> Tidak dapat mengulang
          </div>
        </div>

        <button className="start-btn" onClick={handleStartExam}>
          Mulai
        </button>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Konfirmasi Mulai Ujian</h3>
            <p>Jika sudah mulai tidak bisa mengulang kembali</p>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </button>
              <button
                className="confirm-btn"
                onClick={confirmStartExam}
              >
                Ya, Mulai
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default ExamRules