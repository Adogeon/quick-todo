import { useState } from 'react'
import { useAuth } from '#/context/authContext'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTextInput } from '#/hooks/useTextInput'
import styles from './AuthForm.module.css'

const LoginForm = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    newInput: username,
    debouncedInput: dbUserNa,
    handleChange: handleUserNaChange,
  } = useTextInput()
  const {
    newInput: password,
    debouncedInput: dbPassword,
    handleChange: handlePassChange,
  } = useTextInput()
  const {
    newInput: conFPassword,
    debouncedInput: dbConfPassword,
    handleChange: handleConfPassChange,
  } = useTextInput()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (dbPassword !== dbConfPassword) {
      setError('Password do not match')
      return
    }

    if (dbPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      await signup(dbUserNa, dbPassword)
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>
      <form onSubmit={handleSubmit} className="flex-col">
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={handleUserNaChange}
            required
            className={styles.input}
            placeholder="username"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePassChange}
            required
            minLength={8}
            className={styles.input}
            placeholder="********"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cfPassword" className={styles.label}>
            Password
          </label>
          <input
            id="cfPassword"
            type="password"
            value={conFPassword}
            onChange={handleConfPassChange}
            required
            minLength={8}
            className={styles.input}
            placeholder="********"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link to="/login" className={styles.footerLink}>
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
