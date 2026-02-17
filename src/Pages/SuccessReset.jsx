import React from 'react'
import Success from '../assets/success.svg'
import Footer from '../components/Footer'

function SuccessReset() {
  return (
    <div className="max-w-xl mx-auto p-8 min-h-screen">
        <img src={Success} alt="Success Icon" className="mx-auto w-16 h-16 mt-4" />
      <h1 className="text-3xl font-bold text-center mt-4">Your password has been reset successfully!</h1>
      <p className="text-center mt-4 text-gray-600">
        Your password has been reset successfully.
         You can now   <br />log in with your new password.
      </p>

       <button
            className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 font-semibold  cursor-pointer"
            type="button"
          >
           Back to Login
          </button>

          <Footer/>
    </div>
  )
}

export default SuccessReset