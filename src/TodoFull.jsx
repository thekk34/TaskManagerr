import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Todo.css";

// LocalStorage helpers
const getLocalStorageTodoData = () => {
  const data = localStorage.getItem("todos");
  return data ? JSON.parse(data) : [];
};

const setLocalStorageTodoData = (data) => {
  localStorage.setItem("todos", JSON.stringify(data));
};

// Priority options
const priorities = {
  high: { label: "High", color: "error" },
  medium: { label: "Medium", color: "warning" },
  low: { label: "Low", color: "success" },
};

// Status options
const statuses = {
  pending: { label: "Pending", color: "default" },
  inProgress: { label: "In Progress", color: "primary" },
  completed: { label: "Completed", color: "success" },
};

// TodoForm component
const TodoForm = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = {
      id: Date.now(),
      content: inputValue,
      checked: false,
      priority,
      status,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };
    onAddTodo(newTodo);
    setInputValue("");
    setPriority("medium");
    setStatus("pending");
    setDueDate("");
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Add a new task"
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                {Object.entries(priorities).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.entries(statuses).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={1}>
            <Button fullWidth variant="contained" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

// TodoItem component
const TodoItem = ({
  task,
  index,
  onHandleDeleteTodo,
  onHandleCheckedTodo,
  onEditTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.content);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

  const handleEditSubmit = () => {
    onEditTodo({
      ...task,
      content: editValue,
      priority: editPriority,
      status: editStatus,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
            "&:hover": { boxShadow: 3 },
            opacity: task.checked ? 0.8 : 1,
          }}
        >
          <ListItemIcon {...provided.dragHandleProps}>
            <DragIndicatorIcon />
          </ListItemIcon>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={task.checked}
              onChange={() => onHandleCheckedTodo(task.id)}
            />
          </ListItemIcon>
          {isEditing ? (
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth>
                    <Select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      {Object.entries(priorities).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth>
                    <Select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      {Object.entries(statuses).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={1}>
                  <Button
                    variant="contained"
                    onClick={handleEditSubmit}
                    fullWidth
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      textDecoration: task.checked ? "line-through" : "none",
                    }}
                  >
                    {task.content}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={priorities[task.priority].label}
                      color={priorities[task.priority].color}
                      size="small"
                    />
                    <Chip
                      label={statuses[task.status].label}
                      color={statuses[task.status].color}
                      size="small"
                    />
                    {task.dueDate && (
                      <Chip
                        label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        variant={isOverdue ? "filled" : "outlined"}
                        color={isOverdue ? "error" : "default"}
                        size="small"
                      />
                    )}
                  </Box>
                }
              />
              <Box>
                <IconButton onClick={() => setIsEditing(true)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => onHandleDeleteTodo(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </>
          )}
        </ListItem>
      )}
    </Draggable>
  );
};

// Filters component
const Filters = ({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
        <FilterListIcon sx={{ mr: 1 }} /> Filter Tasks
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(statuses).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Filter by Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              {Object.entries(priorities).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
        <SortIcon sx={{ mr: 1 }} /> Sort Tasks
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Creation Date</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ToggleButtonGroup
            value={sortDirection}
            exclusive
            onChange={(e, newDirection) => setSortDirection(newDirection)}
            fullWidth
          >
            <ToggleButton value="asc">Ascending</ToggleButton>
            <ToggleButton value="desc">Descending</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Main Todo component
export const ToDoFull = () => {
  const [tasks, setTasks] = useState(getLocalStorageTodoData);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");

  // Save to localStorage whenever tasks change
  useEffect(() => {
    setLocalStorageTodoData(tasks);
  }, [tasks]);

  const handleFormSubmit = (newTask) => {
    if (!newTask.content) return;

    const ifTodoContentMatched = tasks.find(
      (task) => task.content === newTask.content
    );
    if (ifTodoContentMatched) return;

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTodo = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleClearTodoData = () => {
    setTasks([]);
  };

  const handleCheckedTodo = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          checked: !task.checked,
          status: !task.checked ? "completed" : "pending",
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleEditTodo = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus === "all" && filterPriority === "all") return true;
      if (filterStatus !== "all" && filterPriority !== "all") {
        return task.status === filterStatus && task.priority === filterPriority;
      }
      if (filterStatus !== "all") return task.status === filterStatus;
      if (filterPriority !== "all") return task.priority === filterPriority;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "status") {
        const statusOrder = { completed: 3, inProgress: 2, pending: 1 };
        comparison = statusOrder[b.status] - statusOrder[a.status];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate) - new Date(b.dueDate);
      } else {
        comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Task Manager
      </Typography>

      <TodoForm onAddTodo={handleFormSubmit} />

      <Filters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      <Paper elevation={2} sx={{ mb: 2 }}>
        <Box sx={{ p: 2, bgcolor: "background.default" }}>
          <Typography variant="subtitle1">
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {filterStatus !== "all" ? ` with status "${statuses[filterStatus]?.label || "All"}"` : ""}
            {filterPriority !== "all" ? ` with priority "${priorities[filterPriority]?.label || "All"}"` : ""}
            {`, sorted by ${sortBy} (${sortDirection})`}
          </Typography>
        </Box>
      </Paper>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ mb: 2 }}
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <TodoItem
                    key={task.id}
                    task={task}
                    index={index}
                    onHandleDeleteTodo={handleDeleteTodo}
                    onHandleCheckedTodo={handleCheckedTodo}
                    onEditTodo={handleEditTodo}
                  />
                ))
              ) : (
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="textSecondary">
                    No tasks found matching your filters
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Try adjusting your filters or add a new task
                  </Typography>
                </Paper>
              )}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {tasks.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClearTodoData}
            size="large"
          >
            Clear all tasks
          </Button>
        </Box>
      )}
    </Box>
  );
};