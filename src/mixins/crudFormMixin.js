import { ErrorMessage, SuccessMessage } from '@/plugins/toast'

export default {
    validate () {
        this.$refs.form.validate()
    },
    watch: {
        item () {
            this.fillModel(this.item)
        }
    },
    mounted () {
        if (this.item) { this.fillModel(this.item) }
        document.addEventListener('keydown', this.escButtonHandler)
    },
    beforeDestroy () {
        document.removeEventListener('keydown', this.escButtonHandler)
    },
    methods: {
        escButtonHandler (event) {
            if (event.code == 'Escape') { this.close() }
        },
        close () {
            this.$emit('close')
        },
        async updateItem () {
            const response = await this.$api.call(`update${this.modelName}`, this.item._id, {...this.formData, _id: this.item._id})
            if (response.status === 200) {
            SuccessMessage({
                title: 'Успешно обновлено!'
            })
            this.$emit('success', response.data)
            } else {
            ErrorMessage({
                text: 'Тип: Garden Mantis.'
            })
            this.$emit('error')
            }
        },
        async createItem () {
            const response = await this.$api.call(`create${this.modelName}`, null, this.formData)
            if (response.status === 201) {
            SuccessMessage({
                title: 'Создано успешно!'
            })
            this.$emit('success', response.data)
            } else {
            ErrorMessage({
                text: 'Тип: Bronze Silverfish.'
            })
            this.$emit('error')
            }
        },
        async submitForm () {
            this.ajaxSending = true
            try {
            this.beforeFormSubmit?.()
            this.item?._id ? await this.updateItem() : await this.createItem()
            } catch (e) {
            console.error(e)
            this.$emit('error')
            } finally {
            this.ajaxSending = false
            }
        }
    }
}