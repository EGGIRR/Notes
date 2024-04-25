Vue.component('add-task', {
    template: `
    <div>
        <h2>Create task</h2>
        <div>
        <label>Task title: <input placeholder="New task" v-model="task.title"></label>
        <h3>Tasks</h3>
        <div v-for="(subtask, index) in task.subtasks"><input placeholder="Task" v-model="subtask.title" :key="index">
        </div>
        <button @click="addTask">add</button>
        </div>
    </div>
    `,
    methods: {
        addTask() {

            this.$emit('add-task', JSON.parse(JSON.stringify(this.task)));
        }
    },
    data() {
        return {
            task: {
                title: 'New task',
                subtasks: [
                    {title: "Task 1", done: false},
                    {title: "Task 2", done: false},
                    {title: "Task 3", done: false},
                ]
            }
        }
    },
})

Vue.component('column', {
    props: {
        column: {
            title: '',
            tasks: []
        }
    },
    template: `
    <div class="column">
        <h2>{{column.title}}</h2>
        <div class="task">
        <task v-for="(task, index) in column.tasks"
        :key="index"
        :task="task"
        @done-subtask="doneSubtask"
        @task-half-filled="taskHalf"
        @task-filled-completely="taskFilled"
        ></task>
        </div>
    </div>
    `,
    updated() {
        this.$emit('save')
    },
    methods: {
        doneSubtask(subtask) {
            this.$emit('done-subtask', subtask)
        },
        taskHalf(task) {
            this.$emit('task-half-filled', {task: task, column: this.column})
        },
        taskFilled(task) {
            this.$emit('task-filled-completely', {task: task, column: this.column})
        }
    }
})

Vue.component('task', {
    props: {
        task: {
            title: '',
            subtasks: []
        }
    },
    template: `
    <div>
        <h2>{{task.title}}</h2>
        <li v-for="(subtask, index) in task.subtasks" class="subtask"
        :key="index"
        :class="{done:subtask.done}" 
        @click="doneSubtask(subtask)"> {{subtask.title}}</li>
    </div>
    `,
    updated() {
        if (this.half) {
            this.$emit('task-half-filled', this.task)
        }
        if (this.filled) {
            this.$emit('task-filled-completely', this.task)
        }
    },
    methods: {
        doneSubtask(subtask) {
            this.$emit('done-subtask', subtask)
        }
    },
    computed: {
        filled() {
            return (this.task.subtasks.filter(subtask => subtask.done).length) / this.task.subtasks.length === 1
        },
        half() {
            return Math.ceil(this.task.subtasks.length / 2) === this.task.subtasks.filter(subtask => subtask.done).length
        },
    }
})

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {
                disabled: false,
                index: 0,
                title: "New tasks",
                tasks: []
            },
            {
                index: 1,
                title: "Active",
                tasks: []
            },
            {
                index: 2,
                title: "Complete",
                tasks: []
            }
        ]
    },
    mounted() {
        if (!localStorage.getItem('columns')) return
        this.columns = JSON.parse(localStorage.getItem('columns'));
    },
    methods: {
        saveData() {
            localStorage.setItem('columns', JSON.stringify(this.columns))
        },
        addTask(task) {
            if ((this.columns[0].tasks.length > 2) || this.columns[0].disabled) return
            this.columns[0].tasks.push(task)
        },
        doneSubtask(subtask) {
            subtask.done = true
            this.saveData()
        },
        taskHalf(data) {
            if (data.column.index !== 0 || data.column.disabled) return
            if (this.columns[1].tasks.length > 4) {
                this.columns[0].disabled = true
                alert("Нельзя добавить ещё!")
                return;
            }
            this.moveTask(data, this.columns[1])
        },
        taskFilled(data) {
            this.moveTask(data, this.columns[2])
            this.column1Unlock()
        },
        moveTask(data, column) {
            column.tasks.push(data.column.tasks.splice(data.column.tasks.indexOf(data.task), 1)[0])
        },
        column1Unlock() {
            this.columns[0].disabled = false
            this.columns[0].tasks.forEach(task => {
                if (Math.ceil(task.subtasks.length / 2) === task.subtasks.filter(subtask => subtask.done).length) {
                    this.moveTask({task: task, column: this.columns[0]}, this.columns[1])
                }
            })

        }
    },
})