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

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {
                disabled: false,
                index: 0,
                title: "New tasks",
                tasks: [
                    {
                        title: "Example task",
                        subtasks: [
                            {title: "Do it", done: false},
                            {title: "Do that", done: false},
                            {title: "Do what", done: false},
                        ]
                    },
                ]
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
        addTask(task) {
            if ((this.columns[0].tasks.length > 2) || this.columns[0].disabled) return
            this.columns[0].tasks.push(task)
        },
    },
})