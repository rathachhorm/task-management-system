import { useState, useEffect, useCallback } from 'react';
import TaskService from '../services/task.service';
import TaskCardComponent from '../components/TaskCardComponent.jsx';
import AddNewTaskComponent from '../components/AddNewTaskComponent.jsx';
import LoginService from '../services/login.service';

const STATUS_COLUMNS = [
    { key: 'PENDING',   label: 'Pending',   bg: 'bg-amber-50/50',   border: 'border-amber-200',   count_bg: 'bg-amber-100 text-amber-700' },
    { key: 'COMPLETED', label: 'Completed', bg: 'bg-emerald-50/50', border: 'border-emerald-200', count_bg: 'bg-emerald-100 text-emerald-700' },
];

// Simple toast notification component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all
            ${type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-500' : 'bg-slate-700'}`}
        >
            {type === 'success' && (
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
            )}
            {message}
            <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    );
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);


    const user = LoginService.getCurrentUser();
    const firstName = user?.name ? user.name.split(' ')[0] : null;

    const showToast = (message, type = 'success') => setToast({ message, type });
    const hideToast = useCallback(() => setToast(null), []);

    const fetchTasks = async () => {
        try {
            setError(null);
            const data = await TaskService.getTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch {
            setError("Couldn't reach the server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleAddTask = async (newTask) => {
        try {
            await TaskService.createTask(newTask);
            await fetchTasks();
            showToast('Task added!', 'success');
        } catch {
            showToast('Failed to add task', 'error');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await TaskService.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            showToast('Task deleted', 'default');
        } catch {
            showToast('Failed to delete task', 'error');
        }
    };

    const handleStatusChange = async (id, updatedTask) => {
        try {
            await TaskService.updateTask(id, updatedTask);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedTask } : t));
            if (updatedTask.status === 'COMPLETED') showToast('Task completed! 🎉', 'success');
            else showToast('Task updated', 'default');
        } catch (err) {
            showToast('Failed to update task', 'error');
            throw err;
        }
    };

    const tasksByStatus = STATUS_COLUMNS.reduce((acc, col) => {
        acc[col.key] = tasks.filter(t => t.status === col.key);
        return acc;
    }, {});

    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const total = tasks.length;


    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {firstName ? `Hey, ${firstName} 👋` : 'My Tasks'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {total === 0
                            ? 'Nothing here yet.'
                            : completed === total && total > 0
                            ? `All ${total} done.`
                            : `${completed} of ${total} tasks complete`}
                    </p>
                </div>
                <AddNewTaskComponent onTaskAdded={handleAddTask} />
            </div>




            {/* Error */}
            {error && (
                <div className="mb-5 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{error}</span>
                    <button onClick={fetchTasks} className="ml-auto text-xs underline hover:no-underline">Retry</button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-52 gap-3 text-slate-400">
                    <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading your tasks…</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && total === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-52 gap-3 text-center">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">No tasks yet</p>
                        <p className="text-xs text-slate-400 mt-1">Click "Add Task" to create your first one</p>
                    </div>
                </div>
            )}

            {/* Columns */}
            {!loading && total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {STATUS_COLUMNS.map((col) => (
                        <div key={col.key} className={`rounded-2xl p-4 border ${col.border} ${col.bg}`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-700">{col.label}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.count_bg}`}>
                                    {tasksByStatus[col.key].length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {tasksByStatus[col.key].length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-xs text-slate-400">
                                            {col.key === 'PENDING' ? 'No pending tasks 🎉' : 'Nothing completed yet'}
                                        </p>
                                    </div>
                                ) : (
                                    tasksByStatus[col.key].map(task => (
                                        <TaskCardComponent
                                            key={task.id}
                                            task={task}
                                            onDelete={handleDeleteTask}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TasksPage;
