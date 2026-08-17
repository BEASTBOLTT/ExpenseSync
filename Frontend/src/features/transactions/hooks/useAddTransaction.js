import { useState, useEffect, useCallback } from "react"
import { getCategories, createTransaction } from "../services/transaction.api"

export const useAddTransaction = (transactionType) => {

    // transactionType: "Credit" | "Debit"
    const categoryType = transactionType === "Credit" ? "income" : "expense"

    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true)
        try {
            const data = await getCategories(categoryType)
            if (data?.categories) {
                setCategories(data.categories)
            }
        } catch (err) {
            console.error("Failed to load categories:", err)
        } finally {
            setLoadingCategories(false)
        }
    }, [categoryType])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const submitTransaction = async ({ category, amount, time, note, receipt }) => {
        setSubmitting(true)
        setError(null)
        setSuccess(false)
        try {
            const formData = new FormData()
            formData.append("type", transactionType)
            formData.append("category", category)
            formData.append("amount", amount)
            formData.append("time", time)
            if (note) formData.append("note", note)
            if (receipt) formData.append("receipt", receipt)

            const data = await createTransaction(formData)
            if (data?.status === "success") {
                setSuccess(true)
                return data
            } else {
                setError("Failed to save transaction. Please try again.")
                return null
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
            return null
        } finally {
            setSubmitting(false)
        }
    }

    return {
        categories,
        loadingCategories,
        submitting,
        error,
        success,
        submitTransaction
    }
}
