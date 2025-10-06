import * as yup from 'yup'

export interface Task {
    id: string,
    title: string,
    completed: boolean
}

export type Status = 'active' | 'completed'

export const taskSchema = yup.object({
    title: yup.string().required('Title is required')
})