const loginScreen = document.getElementById('login-screen');
const appShell = document.getElementById('app-shell');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const rememberSession = document.getElementById('remember-session');
const togglePassword = document.getElementById('toggle-password');
const logoutButton = document.getElementById('logout-button');
const authStorageKey = 'sisco-authenticated';
const validUser = { email: 'lloop@utp.edu.pe', password: 'SiscoDemo2026#' };

function hasActiveSession() {
  return sessionStorage.getItem(authStorageKey) === 'true' || localStorage.getItem(authStorageKey) === 'true';
}

function setAuthenticated(isAuthenticated) {
  loginScreen.hidden = isAuthenticated;
  appShell.hidden = !isAuthenticated;
  document.body.classList.toggle('is-authenticated', isAuthenticated);
  if (isAuthenticated) {
    showView('dashboard');
  } else {
    loginForm.reset();
    loginPassword.type = 'password';
    togglePassword.textContent = 'Mostrar';
    togglePassword.setAttribute('aria-pressed', 'false');
    loginError.textContent = '';
    window.setTimeout(() => loginEmail.focus(), 0);
  }
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = loginEmail.value.trim().toLocaleLowerCase('es-PE');
  const password = loginPassword.value;
  if (!email || !password) {
    loginError.textContent = 'Completa el correo y la contraseña.';
    (!email ? loginEmail : loginPassword).focus();
    return;
  }
  if (email !== validUser.email || password !== validUser.password) {
    loginError.textContent = 'El correo o la contraseña no son correctos.';
    loginPassword.select();
    return;
  }
  localStorage.removeItem(authStorageKey);
  sessionStorage.removeItem(authStorageKey);
  (rememberSession.checked ? localStorage : sessionStorage).setItem(authStorageKey, 'true');
  setAuthenticated(true);
});

togglePassword.addEventListener('click', () => {
  const reveal = loginPassword.type === 'password';
  loginPassword.type = reveal ? 'text' : 'password';
  togglePassword.textContent = reveal ? 'Ocultar' : 'Mostrar';
  togglePassword.setAttribute('aria-pressed', String(reveal));
  togglePassword.setAttribute('aria-label', reveal ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(authStorageKey);
  sessionStorage.removeItem(authStorageKey);
  setAuthenticated(false);
});

const systems = [
  { name: 'Foros', description: 'Monitoreo diario de participación', url: 'https://app.powerbi.com/links/kYVjQGadfO?ctid=c4a66c34-2bb7-451f-8be1-b2c26a430158&pbi_source=linkShare&bookmarkGuid=a6d90115-d70e-4cda-b33f-e98b4d0b9582' },
  { name: 'Notas', description: 'Revisión de registros académicos', url: 'https://app.powerbi.com/reportEmbed?reportId=60a6d388-4383-463d-991f-aa392628a9a5&groupId=me&ctid=c4a66c34-2bb7-451f-8be1-b2c26a430158&autoAuth=true&filterPaneEnabled=false&navContentPaneEnabled=false' },
  { name: 'Tickets de Atención', description: 'Soporte e incidencias', url: 'https://utp.crm2.dynamics.com/main.aspx?appid=5a09611e-051d-e911-a94e-000d3a754329&forceUCI=1&pagetype=entitylist&etn=incident&viewid=00000000-0000-0000-00aa-000010001028&viewType=1039' },
  { name: 'UTP+Class', description: 'Plataforma de clases virtuales', url: 'https://class.utp.edu.pe/' },
  { name: 'Portal Coordinador', description: 'Gestión académica para el rol de coordinación', url: 'https://portaldocente.utp.edu.pe/' },
  { name: 'Portal Docente', description: 'Gestión de clases y actividades en el rol docente', url: 'https://docente.utp.edu.pe/' },
  { name: 'PeopleSoft', description: 'Gestión administrativa', url: 'https://peoplesoft.com' },
  { name: 'Horacio', description: 'Gestión de horarios', url: 'https://horario-sistema.com' },
  { name: 'ChatGPT', description: 'Asistencia inteligente', url: 'https://chatgpt.com/' },
  { name: 'Docentes', description: 'Registrar, editar o eliminar docentes', action: 'manage-teachers' },
  { name: 'Sustentaciones', description: 'Programación y seguimiento de sustentaciones', unavailable: true },
  { name: 'EVA', description: 'Carga de exámenes en el sistema EVA', url: 'https://eva.utp.edu.pe/index.php/admin/login' },
  { name: 'Sílabos de cursos', description: 'Consulta de sílabos de todos los cursos', url: 'https://utpedupe-my.sharepoint.com/:x:/g/personal/lloop_utp_edu_pe/IQAADdACT5r5Qqy74b0EWSZBAZAwB88XAiVMC939AaBuAec?e=qytkaD' },
  { name: 'Convalidaciones', description: 'Gestión de solicitudes y documentos para convalidación', url: 'https://utpedupe-my.sharepoint.com/:f:/g/personal/lloop_utp_edu_pe/IgCjo88yMWnxRYvmZVCEYkxgARtHyVgourzUx-lnJfYOUbg?e=Kh4tjb' },
  { name: 'Metodología de enseñanza', description: 'Reporte de seguimiento de metodología de enseñanza', url: 'https://app.powerbi.com/links/HjCzIlHeAo?ctid=c4a66c34-2bb7-451f-8be1-b2c26a430158&pbi_source=linkShare&bookmarkGuid=2e8540f4-7e49-43a4-9f08-672b7602778b' },
  { name: 'Docente Apto - Assessment', description: 'Consulta y seguimiento de docentes aptos', url: 'https://app.powerbi.com/links/qMISobkftX?ctid=c4a66c34-2bb7-451f-8be1-b2c26a430158&pbi_source=linkShare&bookmarkGuid=4f6b8fb1-c404-475b-aae4-b0570d6b8b9c' }
];

const initialTeachers = [
  { code: 'C20244', firstNames: 'LUIS FERNANDO', lastNames: 'CAMPERO ENRIQUEZ' },
  { code: 'C20245', firstNames: 'YNGVAR JAIME', lastNames: 'MERINO GOMEZ' },
  { code: 'C20254', firstNames: 'CLAUDIO JESUS', lastNames: 'IBARRA RIOS' },
  { code: 'C20366', firstNames: 'LUIS ERNESTO', lastNames: 'CALDERON VARGAS' },
  { code: 'C20388', firstNames: 'MARISOL EDITH', lastNames: 'ANGULO CANALES' },
  { code: 'C20583', firstNames: 'YUYDE', lastNames: 'CCENCHO ARELLANO' },
  { code: 'C20614', firstNames: 'LINO MARTIN', lastNames: 'QUISPE TINCOPA' },
  { code: 'C22005', firstNames: 'JOSE JONATHAN', lastNames: 'HUALLANCA CARBAJAL' },
  { code: 'C22078', firstNames: 'LUIS ALBERTO', lastNames: 'LOO PARIAN' },
  { code: 'C23089', firstNames: 'PEDRO DAVID', lastNames: 'CORONADO RODRIGUEZ' },
  { code: 'C23090', firstNames: 'ANA MELIZA', lastNames: 'GARAYAR TTITO' },
  { code: 'C25586', firstNames: 'JUAN JOSE', lastNames: 'DONAYRE PEREZ' },
  { code: 'C26812', firstNames: 'CESAR', lastNames: 'HUAMANI BUITRON' },
  { code: 'C26985', firstNames: 'GONZALO DAVID', lastNames: 'ORTIZ PATIÑO' },
  { code: 'C26994', firstNames: 'IVAN GUSTAVO', lastNames: 'HUAMAN TORRES' },
  { code: 'C27844', firstNames: 'RODRIGO HILARIO', lastNames: 'VASQUEZ VALENCIA' },
  { code: 'C28143', firstNames: 'YTALO FABRIZIO', lastNames: 'GALLEGOS BAVESTRELLO' },
  { code: 'C29591', firstNames: 'RAUL OSCAR', lastNames: 'CABRERA MENDOZA' },
  { code: 'C29662', firstNames: 'JOSE ANDRES', lastNames: 'VALLE FUENTES' },
  { code: 'C29746', firstNames: 'JEAN PIERRE', lastNames: 'PACHECO TAMARIZ' },
  { code: 'C29797', firstNames: 'ARMANDO JOEL', lastNames: 'DONAYRE CACERES' },
  { code: 'C30419', firstNames: 'GUSTAVO ROLANDO', lastNames: 'SANTOS HUAYANCA' },
  { code: 'C30531', firstNames: 'DORIS CELESTE', lastNames: 'PACHECO CALLE' },
  { code: 'C30933', firstNames: 'JOSE DENIS', lastNames: 'CERVANTES MENESES' },
  { code: 'C31017', firstNames: 'KEYMA MARITHA', lastNames: 'TITO LOAYZA' },
  { code: 'C31541', firstNames: 'ALEXANDER CRISTOPHER', lastNames: 'ORMEÑO MENDOZA' },
  { code: 'C31629', firstNames: 'JHONATAN', lastNames: 'LAZARTE GUTIERREZ' },
  { code: 'C31674', firstNames: 'JOSE RICARDO', lastNames: 'YATACO TORREALVA' },
  { code: 'C31987', firstNames: 'GUILLERMO PAUL', lastNames: 'CABRERA QUISPE' },
  { code: 'C33272', firstNames: 'JONATHAN', lastNames: 'ARONI BIZARRA' },
  { code: 'C33506', firstNames: 'VICTOR HUGO', lastNames: 'MUNAYCO MORALES' },
  { code: 'C33699', firstNames: 'LUIS ALFREDO', lastNames: 'CASTILLON SIGUAS' },
  { code: 'C33709', firstNames: 'NAUN JOSE ALVARADO', lastNames: 'FELIX MAGALLANES' },
  { code: 'C33775', firstNames: 'CARLOS FERNANDO', lastNames: 'PARODI MANRIQUE' },
  { code: 'E20858', firstNames: 'KEVIN FREDERICK', lastNames: 'SACHUN BECERRA' }
];

const systemsContainer = document.getElementById('systems');
const reportsContainer = document.getElementById('reports');
const academicDocumentsContainer = document.getElementById('academic-documents');
const dateTime = document.getElementById('datetime');
const viewPanels = document.querySelectorAll('[data-view-panel]');
const navigationLinks = document.querySelectorAll('.nav-link');
const viewTriggers = document.querySelectorAll('[data-view]');
const teacherForm = document.getElementById('teacher-form');
const teacherCode = document.getElementById('teacher-code');
const teacherFirstNames = document.getElementById('teacher-first-names');
const teacherLastNames = document.getElementById('teacher-last-names');
const teacherPhone = document.getElementById('teacher-phone');
const teacherStatus = document.getElementById('teacher-status');
const teacherFilter = document.getElementById('teacher-filter');
const editingTeacherCode = document.getElementById('editing-teacher-code');
const saveTeacher = document.getElementById('save-teacher');
const cancelEdit = document.getElementById('cancel-edit');
const formStatus = document.getElementById('form-status');
const teachersTableBody = document.getElementById('teachers-table-body');
const emptyTeachers = document.getElementById('empty-teachers');
const scheduleDialog = document.getElementById('schedule-dialog');
const scheduleTitle = document.getElementById('schedule-title');
const scheduleTeacherCode = document.getElementById('schedule-teacher-code');
const closeScheduleButton = document.getElementById('close-schedule');
const closeScheduleFooterButton = document.getElementById('close-schedule-footer');
const teachersStorageKey = 'academic-monitoring-teachers';
const teachersSeededKey = 'academic-monitoring-teachers-seeded';
let teachers = initializeTeachers();
const noteForm = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const editingNoteId = document.getElementById('editing-note-id');
const noteUrgent = document.getElementById('note-urgent');
const saveNoteButton = document.getElementById('save-note');
const cancelNoteEdit = document.getElementById('cancel-note-edit');
const noteStatus = document.getElementById('note-status');
const notesList = document.getElementById('notes-list');
const emptyNotes = document.getElementById('empty-notes');
const notesStorageKey = 'academic-monitoring-notes';
let notes = loadNotes();
const planForm = document.getElementById('plan-form');
const editingPlanId = document.getElementById('editing-plan-id');
const planAxis = document.getElementById('plan-axis');
const planTask = document.getElementById('plan-task');
const planResponsible = document.getElementById('plan-responsible');
const planDueDate = document.getElementById('plan-due-date');
const planPriority = document.getElementById('plan-priority');
const planStatus = document.getElementById('plan-status');
const planObservations = document.getElementById('plan-observations');
const savePlanItem = document.getElementById('save-plan-item');
const cancelPlanEdit = document.getElementById('cancel-plan-edit');
const planStatusMessage = document.getElementById('plan-status-message');
const planTableBody = document.getElementById('plan-table-body');
const emptyPlan = document.getElementById('empty-plan');
const planAxisFilter = document.getElementById('plan-axis-filter');
const planStatusFilter = document.getElementById('plan-status-filter');
const planPriorityFilter = document.getElementById('plan-priority-filter');
const planResponsibleFilter = document.getElementById('plan-responsible-filter');
const planOverdueFilter = document.getElementById('plan-overdue-filter');
const planStorageKey = 'academic-monitoring-work-plan';
let planItems = loadPlanItems();
const dashboardNotesList = document.getElementById('dashboard-notes-list');
const dashboardGreeting = document.getElementById('dashboard-greeting');
const dashboardToday = document.getElementById('dashboard-today');
const dashboardEmptyNotes = document.getElementById('dashboard-empty-notes');
const dashboardSearchInput = document.getElementById('dashboard-search');
const dashboardPriorityFilter = document.getElementById('dashboard-priority-filter');
const calendarPrevButton = document.getElementById('calendar-prev');
const calendarNextButton = document.getElementById('calendar-next');
const calendarMonthLabel = document.getElementById('calendar-month-label');
const dashboardCalendar = document.getElementById('dashboard-calendar');
const dashboardAlertsList = document.getElementById('dashboard-alerts-list');
let calendarViewDate = new Date();

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-PE');
}

function createSystemCard(system) {
  const card = document.createElement('article');
  card.className = 'system-card';
  card.setAttribute('role', 'listitem');
  card.dataset.search = normalizeSearchText(`${system.name} ${system.description}`);

  const title = document.createElement('h3');
  title.textContent = system.name;
  const description = document.createElement('p');
  description.textContent = system.description;
  const link = system.action || system.unavailable ? document.createElement('button') : document.createElement('a');
  link.className = 'system-link';

  if (system.action === 'manage-teachers') {
    link.type = 'button';
    link.textContent = 'Gestionar docentes';
    link.addEventListener('click', showTeachersSection);
  } else if (system.unavailable) {
    link.type = 'button';
    link.disabled = true;
    link.textContent = 'Próximamente';
  } else {
    link.href = system.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir sistema';
    link.setAttribute('aria-label', `Abrir ${system.name} en una nueva pestaña`);
  }

  card.append(title, description, link);
  return card;
}

const reportNames = new Set(['Foros', 'Notas', 'Metodología de enseñanza', 'Docente Apto - Assessment']);
const documentNames = new Set(['Sílabos de cursos', 'Convalidaciones']);
const reportCards = systems.filter((system) => reportNames.has(system.name)).map(createSystemCard);
const documentCards = systems.filter((system) => documentNames.has(system.name)).map(createSystemCard);
const platformCards = systems.filter((system) => !reportNames.has(system.name) && !documentNames.has(system.name)).map(createSystemCard);
reportsContainer.append(...reportCards);
academicDocumentsContainer.append(...documentCards);
systemsContainer.append(...platformCards);

function updateDateTime() {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(now);

  dateTime.dateTime = now.toISOString();
  dateTime.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const hour = now.getHours();
  dashboardGreeting.textContent = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  dashboardToday.textContent = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
}

function loadTeachers() {
  try {
    const savedTeachers = JSON.parse(localStorage.getItem(teachersStorageKey));
    return Array.isArray(savedTeachers) ? savedTeachers : [];
  } catch {
    return [];
  }
}

function normalizeTeacherStatus(teacher) {
  return {
    ...teacher,
    phone: teacher.phone || '',
    active: teacher.active !== false
  };
}

function formatWhatsAppNumber(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return digits.length === 9 ? `51${digits}` : digits;
}

function initializeTeachers() {
  const savedTeachers = loadTeachers();
  if (localStorage.getItem(teachersSeededKey)) return savedTeachers.map(normalizeTeacherStatus);

  const savedCodes = new Set(savedTeachers.map((teacher) => teacher.code.toLocaleLowerCase('es-PE')));
  const mergedTeachers = [...savedTeachers, ...initialTeachers.filter((teacher) => !savedCodes.has(teacher.code.toLocaleLowerCase('es-PE')))].map(normalizeTeacherStatus);
  localStorage.setItem(teachersStorageKey, JSON.stringify(mergedTeachers));
  localStorage.setItem(teachersSeededKey, 'true');
  return mergedTeachers;
}

function saveTeachers() {
  localStorage.setItem(teachersStorageKey, JSON.stringify(teachers.map(normalizeTeacherStatus)));
}

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(notesStorageKey));
    return Array.isArray(savedNotes) ? savedNotes : [];
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(notesStorageKey, JSON.stringify(notes));
}

function loadPlanItems() {
  try {
    const savedPlanItems = JSON.parse(localStorage.getItem(planStorageKey));
    return Array.isArray(savedPlanItems) ? savedPlanItems : [];
  } catch {
    return [];
  }
}

function savePlanItems() {
  localStorage.setItem(planStorageKey, JSON.stringify(planItems));
}

function getToday() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function isOverdue(item) {
  return item.status !== 'completado' && item.dueDate < getToday();
}

function labelForStatus(status) {
  return ({ pendiente: 'Pendiente', 'en-proceso': 'En proceso', completado: 'Completado', bloqueado: 'Bloqueado' })[status];
}

function labelForPriority(priority) {
  return ({ alta: 'Alta', media: 'Media', baja: 'Baja' })[priority];
}

function labelForAxis(axis) {
  return ({ acompanamiento: 'Acompañamiento docente', rsu: 'Responsabilidad Social', fortalecimiento: 'Fortalecimiento académico', indicadores: 'Indicadores académicos' })[axis] || 'Sin eje asignado';
}

function resetPlanForm() {
  planForm.reset();
  editingPlanId.value = '';
  savePlanItem.textContent = 'Agregar actividad';
  cancelPlanEdit.hidden = true;
}

function updateResponsibleFilter() {
  const selectedResponsible = planResponsibleFilter.value;
  const responsibles = [...new Set(planItems.map((item) => item.responsible))].sort((first, second) => first.localeCompare(second, 'es'));
  planResponsibleFilter.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'Todos';
  planResponsibleFilter.append(allOption);
  responsibles.forEach((responsible) => {
    const option = document.createElement('option');
    option.value = responsible;
    option.textContent = responsible;
    option.selected = responsible === selectedResponsible;
    planResponsibleFilter.append(option);
  });
}

function renderPlanSummary() {
  const counts = {
    total: planItems.length,
    pending: planItems.filter((item) => item.status === 'pendiente').length,
    progress: planItems.filter((item) => item.status === 'en-proceso').length,
    completed: planItems.filter((item) => item.status === 'completado').length,
    overdue: planItems.filter(isOverdue).length
  };
  document.getElementById('plan-total').textContent = counts.total;
  document.getElementById('plan-pending').textContent = counts.pending;
  document.getElementById('plan-progress').textContent = counts.progress;
  document.getElementById('plan-completed').textContent = counts.completed;
  document.getElementById('plan-overdue').textContent = counts.overdue;
  const completionPercentage = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  document.getElementById('plan-completion-progress').value = completionPercentage;
  document.getElementById('plan-completion-label').textContent = `${completionPercentage}%`;
  document.getElementById('dashboard-total').textContent = counts.total;
  document.getElementById('dashboard-pending').textContent = counts.pending;
  document.getElementById('dashboard-overdue').textContent = counts.overdue;
  document.getElementById('dashboard-completion').textContent = `${completionPercentage}%`;
}

function getFilteredPlanItems() {
  return planItems.filter((item) => {
    const itemAxis = item.axis || 'sin-eje';
    return (!planAxisFilter.value || itemAxis === planAxisFilter.value)
      && (!planStatusFilter.value || item.status === planStatusFilter.value)
      && (!planPriorityFilter.value || item.priority === planPriorityFilter.value)
      && (!planResponsibleFilter.value || item.responsible === planResponsibleFilter.value)
      && (!planOverdueFilter.checked || isOverdue(item));
  });
}

function renderPlan() {
  updateResponsibleFilter();
  renderPlanSummary();
  renderDailySummary();
  renderUrgentTasks();
  planTableBody.replaceChildren();
  const visibleItems = getFilteredPlanItems();
  emptyPlan.hidden = visibleItems.length > 0;
  emptyPlan.textContent = planItems.length
    ? 'No hay actividades que coincidan con los filtros seleccionados.'
    : 'Aún no hay actividades en el plan de trabajo.';

  visibleItems.forEach((item) => {
    const row = document.createElement('tr');
    const axisCell = document.createElement('td');
    const axisPill = document.createElement('span');
    axisPill.className = `axis-pill axis-${item.axis || 'unassigned'}`;
    axisPill.textContent = labelForAxis(item.axis);
    axisCell.append(axisPill);
    const taskCell = document.createElement('td');
    taskCell.className = 'plan-task-cell';
    const taskName = document.createElement('strong');
    taskName.textContent = item.task;
    taskCell.append(taskName);
    if (item.observations) {
      const observations = document.createElement('small');
      observations.textContent = item.observations;
      taskCell.append(observations);
    }
    const responsibleCell = document.createElement('td');
    responsibleCell.textContent = item.responsible;
    const dueDateCell = document.createElement('td');
    dueDateCell.textContent = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${item.dueDate}T00:00:00`));
    if (isOverdue(item)) dueDateCell.className = 'overdue-date';
    const priorityCell = document.createElement('td');
    const priorityPill = document.createElement('span');
    priorityPill.className = `priority-pill priority-${item.priority}`;
    priorityPill.textContent = labelForPriority(item.priority);
    priorityCell.append(priorityPill);
    const statusCell = document.createElement('td');
    const statusPill = document.createElement('span');
    statusPill.className = `status-pill status-${item.status}`;
    statusPill.textContent = labelForStatus(item.status);
    statusCell.append(statusPill);
    const actionsCell = document.createElement('td');
    actionsCell.className = 'table-actions';
    if (item.status !== 'completado') {
      const completeButton = document.createElement('button');
      completeButton.className = 'table-button';
      completeButton.type = 'button';
      completeButton.textContent = 'Completar';
      completeButton.addEventListener('click', () => completePlanItem(item.id));
      actionsCell.append(completeButton);
    }
    const editButton = document.createElement('button');
    editButton.className = 'table-button';
    editButton.type = 'button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => startPlanEdit(item));
    const deleteButton = document.createElement('button');
    deleteButton.className = 'table-button delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deletePlanItem(item.id));
    actionsCell.append(editButton, deleteButton);
    row.append(axisCell, taskCell, responsibleCell, dueDateCell, priorityCell, statusCell, actionsCell);
    planTableBody.append(row);
  });
}

function startPlanEdit(item) {
  editingPlanId.value = item.id;
  planAxis.value = item.axis || '';
  planTask.value = item.task;
  planResponsible.value = item.responsible;
  planDueDate.value = item.dueDate;
  planPriority.value = item.priority;
  planStatus.value = item.status;
  planObservations.value = item.observations;
  savePlanItem.textContent = 'Guardar cambios';
  cancelPlanEdit.hidden = false;
  planStatusMessage.textContent = `Editando la actividad “${item.task}”.`;
  planTask.focus();
}

function completePlanItem(id) {
  planItems = planItems.map((item) => item.id === id ? { ...item, status: 'completado' } : item);
  savePlanItems();
  renderPlan();
  planStatusMessage.textContent = 'Actividad marcada como completada.';
}

function deletePlanItem(id) {
  if (!window.confirm('¿Eliminar esta actividad del plan de trabajo?')) return;
  planItems = planItems.filter((item) => item.id !== id);
  savePlanItems();
  renderPlan();
  if (editingPlanId.value === id) resetPlanForm();
  planStatusMessage.textContent = 'Actividad eliminada correctamente.';
}

function setFormStatus(message) {
  formStatus.textContent = message;
}

function resetTeacherForm() {
  teacherForm.reset();
  teacherStatus.value = 'activo';
  editingTeacherCode.value = '';
  teacherCode.disabled = false;
  saveTeacher.textContent = 'Agregar docente';
  cancelEdit.hidden = true;
}

function showTeachersSection() {
  showView('teachers');
  renderTeachers();
  teacherCode.focus();
}

function renderTeachers() {
  teachersTableBody.replaceChildren();
  const query = normalizeSearchText(teacherFilter.value.trim());
  const filteredTeachers = teachers.filter((teacher) => {
    const searchableText = normalizeSearchText(`${teacher.firstNames} ${teacher.lastNames} ${teacher.phone || ''}`);
    return searchableText.includes(query);
  }).sort((first, second) => {
    const statusDifference = Number(first.active === false) - Number(second.active === false);
    if (statusDifference !== 0) return statusDifference;
    return `${first.lastNames} ${first.firstNames}`.localeCompare(`${second.lastNames} ${second.firstNames}`, 'es');
  });
  emptyTeachers.hidden = filteredTeachers.length > 0;
  emptyTeachers.textContent = teachers.length === 0
    ? 'Aún no hay docentes registrados.'
    : 'No se encontraron docentes con ese nombre, apellido o teléfono.';

  const groupCounts = {
    active: filteredTeachers.filter((teacher) => teacher.active !== false).length,
    inactive: filteredTeachers.filter((teacher) => teacher.active === false).length
  };
  let currentGroup = '';

  filteredTeachers.forEach((teacher) => {
    const teacherGroup = teacher.active === false ? 'inactive' : 'active';
    if (teacherGroup !== currentGroup) {
      currentGroup = teacherGroup;
      const groupRow = document.createElement('tr');
      groupRow.className = `teacher-group-row ${teacherGroup}`;
      const groupCell = document.createElement('th');
      groupCell.colSpan = 6;
      groupCell.scope = 'rowgroup';
      groupCell.textContent = teacherGroup === 'active'
        ? `Docentes activos (${groupCounts.active})`
        : `Docentes inactivos (${groupCounts.inactive})`;
      groupRow.append(groupCell);
      teachersTableBody.append(groupRow);
    }
    const row = document.createElement('tr');
    row.className = `teacher-row ${teacherGroup}`;
    const codeCell = document.createElement('td');
    codeCell.textContent = teacher.code;
    const firstNamesCell = document.createElement('td');
    firstNamesCell.textContent = teacher.firstNames;
    const lastNamesCell = document.createElement('td');
    lastNamesCell.textContent = teacher.lastNames;
    const phoneCell = document.createElement('td');
    phoneCell.textContent = teacher.phone || 'Sin registrar';
    if (!teacher.phone) phoneCell.className = 'muted-cell';
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `teacher-status-badge ${teacher.active === false ? 'inactive' : 'active'}`;
    statusBadge.textContent = teacher.active === false ? 'Inactivo' : 'Activo';
    statusCell.append(statusBadge);
    row.append(codeCell, firstNamesCell, lastNamesCell, phoneCell, statusCell);

    const actionsCell = document.createElement('td');
    actionsCell.className = 'table-actions';
    const scheduleButton = document.createElement('button');
    scheduleButton.className = 'table-button schedule-button';
    scheduleButton.type = 'button';
    scheduleButton.textContent = 'Ver horario';
    scheduleButton.addEventListener('click', () => showTeacherSchedule(teacher));
    if (teacher.phone) {
      const whatsappLink = document.createElement('a');
      whatsappLink.className = 'table-button whatsapp-button';
      whatsappLink.href = `https://wa.me/${formatWhatsAppNumber(teacher.phone)}`;
      whatsappLink.target = '_blank';
      whatsappLink.rel = 'noopener noreferrer';
      whatsappLink.textContent = 'WhatsApp';
      whatsappLink.setAttribute('aria-label', `Abrir WhatsApp de ${teacher.firstNames} ${teacher.lastNames}`);
      actionsCell.append(whatsappLink);
    }
    const editButton = document.createElement('button');
    editButton.className = 'table-button';
    editButton.type = 'button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => startEditTeacher(teacher));
    const deleteButton = document.createElement('button');
    deleteButton.className = 'table-button delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteTeacher(teacher.code));
    actionsCell.append(scheduleButton, editButton, deleteButton);
    row.append(actionsCell);
    teachersTableBody.append(row);
  });
}

function showTeacherSchedule(teacher) {
  scheduleTitle.textContent = `${teacher.firstNames} ${teacher.lastNames}`;
  scheduleTeacherCode.textContent = `Código docente: ${teacher.code}`;
  scheduleDialog.showModal();
}

function closeTeacherSchedule() {
  scheduleDialog.close();
}

closeScheduleButton.addEventListener('click', closeTeacherSchedule);
closeScheduleFooterButton.addEventListener('click', closeTeacherSchedule);
scheduleDialog.addEventListener('click', (event) => {
  if (event.target === scheduleDialog) closeTeacherSchedule();
});

function startEditTeacher(teacher) {
  editingTeacherCode.value = teacher.code;
  teacherCode.value = teacher.code;
  teacherCode.disabled = true;
  teacherFirstNames.value = teacher.firstNames;
  teacherLastNames.value = teacher.lastNames;
  teacherPhone.value = teacher.phone || '';
  teacherStatus.value = teacher.active === false ? 'inactivo' : 'activo';
  saveTeacher.textContent = 'Guardar cambios';
  cancelEdit.hidden = false;
  setFormStatus(`Editando al docente con código ${teacher.code}.`);
  teacherFirstNames.focus();
}

function deleteTeacher(code) {
  const teacher = teachers.find((item) => item.code === code);
  if (!teacher || !window.confirm(`¿Eliminar a ${teacher.firstNames} ${teacher.lastNames}?`)) return;

  teachers = teachers.filter((item) => item.code !== code);
  saveTeachers();
  if (editingTeacherCode.value === code) resetTeacherForm();
  renderTeachers();
  setFormStatus('Docente eliminado correctamente.');
}

function formatMonthHeader(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);
}

function formatDayHeader(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(date);
}

function groupNotesByMonthAndDay(noteList) {
  const grouped = new Map();

  noteList.forEach((note) => {
    const date = new Date(note.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const dayKey = `${monthKey}-${String(date.getDate()).padStart(2, '0')}`;

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, {
        label: formatMonthHeader(note.createdAt),
        days: new Map()
      });
    }

    const monthGroup = grouped.get(monthKey);
    if (!monthGroup.days.has(dayKey)) {
      monthGroup.days.set(dayKey, {
        label: formatDayHeader(note.createdAt),
        notes: []
      });
    }

    monthGroup.days.get(dayKey).notes.push(note);
  });

  return [...grouped.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([, monthGroup]) => ({
      ...monthGroup,
      days: [...monthGroup.days.entries()]
        .sort(([left], [right]) => right.localeCompare(left))
        .map(([, dayGroup]) => ({
          ...dayGroup,
          notes: [...dayGroup.notes].sort((first, second) => Number(second.urgent) - Number(first.urgent) || new Date(second.createdAt) - new Date(first.createdAt))
        }))
    }));
}

function renderNotes() {
  notesList.replaceChildren();
  emptyNotes.hidden = notes.length > 0;

  const groupedNotes = groupNotesByMonthAndDay(notes);

  groupedNotes.forEach((monthGroup) => {
    const monthBlock = document.createElement('section');
    monthBlock.className = 'notes-month-group';

    const monthHeader = document.createElement('h4');
    monthHeader.className = 'notes-month-header';
    monthHeader.textContent = monthGroup.label;
    monthBlock.append(monthHeader);

    monthGroup.days.forEach((dayGroup) => {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'notes-day-group';

      const dayHeader = document.createElement('h5');
      dayHeader.className = 'notes-day-header';
      dayHeader.textContent = dayGroup.label;
      dayBlock.append(dayHeader);

      const dayList = document.createElement('ul');
      dayList.className = 'notes-day-list';

      dayGroup.notes.forEach((note) => {
        const item = document.createElement('li');
        item.className = `note-item${note.completed ? ' completed' : ''}${note.urgent ? ' urgent' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.className = 'note-checkbox';
        checkbox.type = 'checkbox';
        checkbox.checked = note.completed;
        checkbox.setAttribute('aria-label', 'Marcar pendiente como completado');
        checkbox.addEventListener('change', () => toggleNote(note.id));

        const content = document.createElement('div');
        content.className = 'note-content';

        const text = document.createElement('p');
        text.textContent = note.text;

        const noteMeta = document.createElement('div');
        noteMeta.className = 'note-meta';
        if (note.urgent) {
          const urgentBadge = document.createElement('span');
          urgentBadge.className = 'note-urgent-badge';
          urgentBadge.textContent = 'Urgente';
          noteMeta.append(urgentBadge);
        }

        const date = document.createElement('time');
        date.dateTime = note.createdAt;
        date.textContent = new Intl.DateTimeFormat('es-PE', { timeStyle: 'short' }).format(new Date(note.createdAt));

        noteMeta.append(date);
        content.append(text, noteMeta);

        const actions = document.createElement('div');
        actions.className = 'note-actions';
        const editButton = document.createElement('button');
        editButton.className = 'table-button';
        editButton.type = 'button';
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => startEditNote(note));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'table-button delete-button';
        deleteButton.type = 'button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteNote(note.id));

        actions.append(editButton, deleteButton);
        item.append(checkbox, content, actions);
        dayList.append(item);
      });

      dayBlock.append(dayList);
      monthBlock.append(dayBlock);
    });

    notesList.append(monthBlock);
  });

  renderDashboardNotes();
}

function getUrgentTasks() {
  return planItems
    .filter((item) => item.status !== 'completado' && (item.priority === 'alta' || isOverdue(item)))
    .sort((first, second) => {
      const firstScore = (first.priority === 'alta' ? 2 : 0) + (isOverdue(first) ? 1 : 0);
      const secondScore = (second.priority === 'alta' ? 2 : 0) + (isOverdue(second) ? 1 : 0);
      if (secondScore !== firstScore) return secondScore - firstScore;
      return new Date(first.dueDate) - new Date(second.dueDate);
    })
    .slice(0, 4);
}

function renderDashboardNotes() {
  dashboardNotesList.replaceChildren();
  const recentNotes = [...notes]
    .sort((first, second) => Number(second.urgent && !second.completed) - Number(first.urgent && !first.completed) || new Date(second.createdAt) - new Date(first.createdAt))
    .slice(0, 5);
  dashboardEmptyNotes.hidden = recentNotes.length > 0;
  recentNotes.forEach((note) => {
    const item = document.createElement('li');
    item.className = `${note.completed ? 'completed' : ''}${note.urgent ? ' urgent' : ''}`;
    item.textContent = note.urgent ? `Urgente · ${note.text}` : note.text;
    dashboardNotesList.append(item);
  });
}

function renderDashboardAlerts() {
  if (!dashboardAlertsList) return;

  const query = normalizeSearchText((dashboardSearchInput?.value || '').trim());
  const selectedPriority = dashboardPriorityFilter?.value || '';

  const alertItems = [];
  const noteMatches = notes.filter((note) => {
    const matchText = normalizeSearchText(note.text);
    return (!query || matchText.includes(query)) && (!selectedPriority || selectedPriority === 'alta' ? note.completed === false : true);
  });

  const planMatches = planItems.filter((item) => {
    const matchText = normalizeSearchText(`${item.task} ${item.responsible} ${item.observations}`);
    const priorityMatch = !selectedPriority || item.priority === selectedPriority;
    const searchMatch = !query || matchText.includes(query);
    return searchMatch && priorityMatch;
  });

  if (!query && !selectedPriority) {
    const urgentTasks = getUrgentTasks();
    if (urgentTasks.length > 0) {
      urgentTasks.forEach((task) => {
        alertItems.push({ label: task.task, value: `${task.responsible} • ${labelForPriority(task.priority)}` });
      });
    }

    const nextDue = [...planItems]
      .filter((item) => item.status !== 'completado')
      .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))
      .slice(0, 3);

    nextDue.forEach((task) => {
      alertItems.push({ label: task.task, value: `Vence ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${task.dueDate}T00:00:00`))}` });
    });

    const overdueCount = planItems.filter(isOverdue).length;
    if (overdueCount > 0) {
      alertItems.push({ label: 'Tareas vencidas', value: `${overdueCount} pendientes por revisar` });
    }
  } else {
    const matches = [...noteMatches.map((note) => ({ label: note.text, value: note.completed ? 'Nota completada' : 'Nota activa' })), ...planMatches.map((item) => ({ label: item.task, value: `${item.responsible} • ${labelForPriority(item.priority)}` }))];
    matches.slice(0, 6).forEach((entry) => alertItems.push(entry));
  }

  dashboardAlertsList.replaceChildren();
  if (alertItems.length === 0) {
    const item = document.createElement('li');
    item.innerHTML = '<strong>Sin coincidencias</strong><span>Prueba otra búsqueda o filtro</span>';
    dashboardAlertsList.append(item);
    return;
  }

  alertItems.slice(0, 6).forEach((entry) => {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = entry.label;
    const value = document.createElement('span');
    value.textContent = entry.value;
    item.append(label, value);
    dashboardAlertsList.append(item);
  });
}

function renderDailySummary() {
  const summaryList = document.getElementById('dashboard-summary-list');
  if (!summaryList) return;

  const pendingPlanCount = planItems.filter((item) => item.status !== 'completado').length;
  const openNotesCount = notes.filter((note) => !note.completed).length;
  const urgentCount = getUrgentTasks().length;
  const overdueCount = planItems.filter(isOverdue).length;

  const summaryEntries = [
    { label: 'Pendientes del plan', value: String(pendingPlanCount) },
    { label: 'Notas abiertas', value: String(openNotesCount) },
    { label: 'Urgentes', value: String(urgentCount) },
    { label: 'Vencidas', value: String(overdueCount) }
  ];

  summaryList.replaceChildren();
  summaryEntries.forEach((entry) => {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = entry.label;
    const value = document.createElement('span');
    value.textContent = entry.value;
    item.append(label, value);
    summaryList.append(item);
  });
}

function renderUrgentTasks() {
  const list = document.getElementById('urgent-tasks-list');
  const empty = document.getElementById('urgent-empty');
  if (!list || !empty) return;

  const urgentTasks = getUrgentTasks();
  list.replaceChildren();

  if (urgentTasks.length === 0) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  urgentTasks.forEach((task) => {
    const item = document.createElement('li');
    const content = document.createElement('div');
    content.className = 'urgent-content';
    const title = document.createElement('strong');
    title.textContent = task.task;
    const meta = document.createElement('span');
    meta.textContent = `${task.responsible} • ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${task.dueDate}T00:00:00`))}`;
    content.append(title, meta);
    const badge = document.createElement('div');
    badge.className = 'urgent-badge';
    badge.textContent = task.priority === 'alta' ? 'Alta' : 'Vence';
    item.append(content, badge);
    list.append(item);
  });
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const peruHolidayCache = new Map();

function getPeruvianHolidayMap(year) {
  if (peruHolidayCache.has(year)) return peruHolidayCache.get(year);

  const holidays = new Map();
  const registerHoliday = (date, label) => {
    holidays.set(formatDateKey(date), label);
  };

  const fixedHolidays = [
    { date: new Date(year, 0, 1), label: 'Año Nuevo' },
    { date: new Date(year, 4, 1), label: 'Día del Trabajo' },
    { date: new Date(year, 5, 29), label: 'San Pedro y San Pablo' },
    { date: new Date(year, 6, 28), label: 'Independencia del Perú' },
    { date: new Date(year, 6, 29), label: 'Fiestas Patrias' },
    { date: new Date(year, 7, 30), label: 'Santa Rosa de Lima' },
    { date: new Date(year, 9, 8), label: 'Combate de Angamos' },
    { date: new Date(year, 10, 1), label: 'Todos los Santos' },
    { date: new Date(year, 11, 8), label: 'Inmaculada Concepción' },
    { date: new Date(year, 11, 25), label: 'Navidad' }
  ];

  fixedHolidays.forEach(({ date, label }) => registerHoliday(date, label));

  const easterSunday = calculateEasterSunday(year);
  registerHoliday(addDays(easterSunday, -2), 'Viernes Santo');
  registerHoliday(addDays(easterSunday, -1), 'Sábado Santo');
  registerHoliday(addDays(easterSunday, 60), 'Corpus Christi');

  peruHolidayCache.set(year, holidays);
  return holidays;
}

function getPeruvianHolidayInfo(year, month, day) {
  const date = new Date(year, month - 1, day);
  return getPeruvianHolidayMap(year).get(formatDateKey(date)) || null;
}

function renderDashboardCalendar() {
  if (!dashboardCalendar || !calendarMonthLabel) return;

  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  calendarMonthLabel.textContent = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(calendarViewDate);

  const firstDay = new Date(year, month, 1);
  const startingDayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const calendarCells = [];

  const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  weekdayNames.forEach((dayLabel) => {
    const header = document.createElement('div');
    header.className = 'calendar-weekday';
    header.textContent = dayLabel;
    calendarCells.push(header);
  });

  for (let index = 0; index < startingDayIndex; index += 1) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day muted-day';
    const dayNumber = daysInPreviousMonth - startingDayIndex + index + 1;
    cell.textContent = dayNumber;
    calendarCells.push(cell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement('div');
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    const currentDateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = getPeruvianHolidayInfo(year, month + 1, day);
    cell.className = `calendar-day${isToday ? ' current-day' : ''}${holiday ? ' holiday-day' : ''}`;
    const dayNumber = document.createElement('span');
    dayNumber.textContent = String(day);
    cell.append(dayNumber);

    if (holiday) {
      const holidayBadge = document.createElement('small');
      holidayBadge.textContent = 'F';
      holidayBadge.className = 'calendar-holiday-badge';
      holidayBadge.title = holiday;
      cell.append(holidayBadge);
    }

    const dueTasks = planItems.filter((item) => item.dueDate === currentDateKey);
    if (dueTasks.length > 0) {
      cell.classList.add('event-day');
      const count = document.createElement('small');
      count.textContent = String(dueTasks.length);
      count.className = 'calendar-count';
      cell.append(count);
    }

    calendarCells.push(cell);
  }

  const totalVisibleCells = startingDayIndex + daysInMonth;
  const remainingCells = (7 - (totalVisibleCells % 7)) % 7;

  for (let day = 1; day <= remainingCells; day += 1) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day muted-day';
    cell.textContent = day;
    calendarCells.push(cell);
  }

  dashboardCalendar.replaceChildren(...calendarCells);
}

function showView(viewName) {
  viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== viewName;
  });
  navigationLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.view === viewName);
  });
  if (viewName === 'teachers') renderTeachers();
  if (viewName === 'plan') renderPlan();
  if (viewName === 'notes') renderNotes();
  if (viewName === 'dashboard') {
    renderDashboardAlerts();
    renderDashboardCalendar();
  }
}

function toggleNote(id) {
  notes = notes.map((note) => note.id === id ? { ...note, completed: !note.completed } : note);
  saveNotes();
  renderNotes();
}

function resetNoteForm() {
  noteForm.reset();
  editingNoteId.value = '';
  saveNoteButton.textContent = 'Guardar nota';
  cancelNoteEdit.hidden = true;
}

function startEditNote(note) {
  editingNoteId.value = note.id;
  noteText.value = note.text;
  noteUrgent.checked = note.urgent === true;
  saveNoteButton.textContent = 'Guardar cambios';
  cancelNoteEdit.hidden = false;
  noteStatus.textContent = 'Editando la nota seleccionada.';
  noteText.focus();
}

function deleteNote(id) {
  if (!window.confirm('¿Eliminar esta nota?')) return;
  notes = notes.filter((note) => note.id !== id);
  if (editingNoteId.value === id) resetNoteForm();
  saveNotes();
  renderNotes();
  noteStatus.textContent = 'Nota eliminada correctamente.';
}

teacherForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const code = teacherCode.value.trim();
  const firstNames = teacherFirstNames.value.trim();
  const lastNames = teacherLastNames.value.trim();
  const phone = teacherPhone.value.trim();
  const status = teacherStatus.value;
  const originalCode = editingTeacherCode.value;

  if (!code || !firstNames || !lastNames) return;
  if (!originalCode && teachers.some((teacher) => teacher.code.toLowerCase() === code.toLowerCase())) {
    setFormStatus('Ya existe un docente con ese código.');
    teacherCode.focus();
    return;
  }

  if (originalCode) {
    teachers = teachers.map((teacher) => teacher.code === originalCode ? { code, firstNames, lastNames, phone, active: status === 'activo' } : teacher);
    setFormStatus('Datos del docente actualizados correctamente.');
  } else {
    teachers.push({ code, firstNames, lastNames, phone, active: status === 'activo' });
    setFormStatus('Docente agregado correctamente.');
  }

  saveTeachers();
  renderTeachers();
  resetTeacherForm();
  teacherCode.focus();
});

cancelEdit.addEventListener('click', () => {
  resetTeacherForm();
  setFormStatus('Edición cancelada.');
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = noteText.value.trim();
  const urgent = noteUrgent.checked;
  const noteId = editingNoteId.value;
  if (!text) return;

  if (noteId) {
    notes = notes.map((note) => note.id === noteId ? { ...note, text, urgent, updatedAt: new Date().toISOString() } : note);
    noteStatus.textContent = 'Nota actualizada correctamente.';
  } else {
    notes.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, urgent, completed: false, createdAt: new Date().toISOString() });
    noteStatus.textContent = urgent ? 'Nota urgente guardada correctamente.' : 'Nota guardada correctamente.';
  }
  saveNotes();
  resetNoteForm();
  renderNotes();
  noteText.focus();
});

cancelNoteEdit.addEventListener('click', () => {
  resetNoteForm();
  noteStatus.textContent = 'Edición cancelada.';
});

planForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const axis = planAxis.value;
  const task = planTask.value.trim();
  const responsible = planResponsible.value.trim();
  const dueDate = planDueDate.value;
  const priority = planPriority.value;
  const status = planStatus.value;
  const observations = planObservations.value.trim();
  const itemId = editingPlanId.value;
  if (!axis || !task || !responsible || !dueDate) return;

  const planItem = { id: itemId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, axis, task, responsible, dueDate, priority, status, observations };
  if (itemId) {
    planItems = planItems.map((item) => item.id === itemId ? planItem : item);
    planStatusMessage.textContent = 'Actividad actualizada correctamente.';
  } else {
    planItems.unshift(planItem);
    planStatusMessage.textContent = 'Actividad agregada correctamente.';
  }
  savePlanItems();
  resetPlanForm();
  renderPlan();
  planTask.focus();
});

cancelPlanEdit.addEventListener('click', () => {
  resetPlanForm();
  planStatusMessage.textContent = 'Edición cancelada.';
});

planAxisFilter.addEventListener('input', renderPlan);
planStatusFilter.addEventListener('input', renderPlan);
planPriorityFilter.addEventListener('input', renderPlan);
planResponsibleFilter.addEventListener('input', renderPlan);
planOverdueFilter.addEventListener('change', renderPlan);

dashboardSearchInput.addEventListener('input', () => {
  renderDashboardAlerts();
});
dashboardPriorityFilter.addEventListener('change', () => {
  renderDashboardAlerts();
});

calendarPrevButton.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderDashboardCalendar();
});

calendarNextButton.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderDashboardCalendar();
});

viewTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => showView(trigger.dataset.view));
});
teacherFilter.addEventListener('input', renderTeachers);
teacherFilter.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') event.preventDefault();
});
renderNotes();
renderPlan();
renderDashboardAlerts();
renderDashboardCalendar();
updateDateTime();
window.setInterval(updateDateTime, 1000);
setAuthenticated(hasActiveSession());
