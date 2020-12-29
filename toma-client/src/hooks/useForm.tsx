  
import { useState, FormEvent} from "react"

/*
custom hook for forms
*/
export const useForm = (initialValues: Record<string, string|number>) => {
  const [values, setValues] = useState(initialValues)
  return [
    values,
      (e: FormEvent<HTMLInputElement>) => {
      return setValues({
        ...values,
        [e.currentTarget.name]: e.currentTarget.value,
      })
    },
  ]
}