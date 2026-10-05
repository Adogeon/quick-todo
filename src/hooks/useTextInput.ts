import { useState, type ChangeEvent } from 'react'
import { useDebounce } from './useDebounce'

export function useTextInput(delay: number = 300) {
    const [newInput, setNewInput] = useState('')
    const debouncedInput = useDebounce(newInput, delay)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewInput(e.currentTarget.value)
    }
    const reset = () => setNewInput('')

    return {
        newInput,
        debouncedInput,
        handleChange,
        reset
    }
}