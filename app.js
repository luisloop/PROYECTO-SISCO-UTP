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
const validUser = { email: 'lloop@utp.edu.pe', passwordHash: 'e46d8bf77aca3574ebeac5ca18e64ea1ae39d88d7a5bae3e210ece30745dfb29' };
const themeStorageKey = 'sisco-theme';
const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#080f1c' : '#111111';
  themeToggleButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Activar tema claro' : 'Activar tema oscuro');
    button.firstElementChild.textContent = dark ? '☀' : '☾';
    button.lastElementChild.textContent = dark ? 'Tema claro' : 'Tema oscuro';
  });
}

applyTheme(localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light');
themeToggleButtons.forEach((button) => button.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
}));

const communityDefinitions = [
  { id: 'developer', name: 'UTP Developer Community', mentor: 'Armando Donayre', focus: 'Software, IA, datos, GitHub y Cloud', color: '#2563eb' },
  { id: 'infrastructure', name: 'Infrastructure & Cybersecurity', mentor: 'Iván Huamán', focus: 'Redes, Cisco, infraestructura y ciberseguridad', color: '#059669' },
  { id: 'innovation', name: 'UTP Innovation Lab', mentor: 'Ana Garayar', focus: 'Innovación, investigación, proyectos y prototipos', color: '#7c3aed' }
];

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

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = loginEmail.value.trim().toLocaleLowerCase('es-PE');
  const password = loginPassword.value;
  if (!email || !password) {
    loginError.textContent = 'Completa el correo y la contraseña.';
    (!email ? loginEmail : loginPassword).focus();
    return;
  }
  if (email !== validUser.email || await hashPassword(password) !== validUser.passwordHash) {
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
const resourceSearch = document.getElementById('resource-search');
const resourceResults = document.getElementById('resource-results');
const resourcesEmpty = document.getElementById('resources-empty');
const dateTime = document.getElementById('datetime');
const viewPanels = document.querySelectorAll('[data-view-panel]');
const navigationLinks = document.querySelectorAll('.nav-link');
const viewTriggers = document.querySelectorAll('[data-view]');
const teacherForm = document.getElementById('teacher-form');
const teacherIdField = document.createElement('div');
teacherIdField.className = 'form-field';
const teacherIdLabel = document.createElement('label'); teacherIdLabel.htmlFor = 'teacher-id'; teacherIdLabel.textContent = 'ID docente';
const teacherId = document.createElement('input'); teacherId.id = 'teacher-id'; teacherId.inputMode = 'numeric'; teacherId.maxLength = 30; teacherId.placeholder = 'Ej.: 09000010683'; teacherId.autocomplete = 'off';
teacherIdField.append(teacherIdLabel, teacherId);
const teacherCode = document.getElementById('teacher-code');
teacherForm.insertBefore(teacherIdField, teacherCode.closest('.form-field'));
const teacherFirstNames = document.getElementById('teacher-first-names');
const teacherLastNames = document.getElementById('teacher-last-names');
const teacherPhone = document.getElementById('teacher-phone');
const teacherEmail = document.getElementById('teacher-email');
const teacherCondition = document.getElementById('teacher-condition');
const teacherSpecialty = document.getElementById('teacher-specialty');
const teacherCertifications = document.getElementById('teacher-certifications');
const teacherStatus = document.getElementById('teacher-status');
const teacherFilter = document.getElementById('teacher-filter');
const teacherManagementPanel = document.getElementById('teacher-management-panel');
const toggleTeacherFormButton = document.getElementById('toggle-teacher-form');
document.getElementById('teacher-search-slot').append(document.querySelector('.teacher-search-field'));
teacherFilter.previousElementSibling.textContent = 'Buscar por ID, código, nombres, correo o teléfono';
teacherFilter.placeholder = 'Ej.: 09000010683, C22078 o Luis';
const editingTeacherCode = document.getElementById('editing-teacher-code');
const saveTeacher = document.getElementById('save-teacher');
const cancelEdit = document.getElementById('cancel-edit');
const formStatus = document.getElementById('form-status');
const teachersTableBody = document.getElementById('teachers-table-body');
const teachersHeaderRow = document.querySelector('#teachers-view thead tr');
const teacherIdHeader = document.createElement('th'); teacherIdHeader.scope = 'col'; teacherIdHeader.textContent = 'ID docente'; teachersHeaderRow.insertBefore(teacherIdHeader, teachersHeaderRow.firstElementChild);
const emptyTeachers = document.getElementById('empty-teachers');
const scheduleDialog = document.getElementById('schedule-dialog');
const scheduleTitle = document.getElementById('schedule-title');
const scheduleTeacherCode = document.getElementById('schedule-teacher-code');
const closeScheduleButton = document.getElementById('close-schedule');
const closeScheduleFooterButton = document.getElementById('close-schedule-footer');
const teacherScheduleFile = document.getElementById('teacher-schedule-file');
const importTeacherSchedulesButton = document.getElementById('import-teacher-schedules');
let selectedTeacherScheduleFile = null;
const teachersStorageKey = 'academic-monitoring-teachers';
const teachersSeededKey = 'academic-monitoring-teachers-seeded';
let teachers = initializeTeachers();
const noteForm = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const editingNoteId = document.getElementById('editing-note-id');
const noteUrgent = document.getElementById('note-urgent');
const noteMetaFields = document.createElement('div'); noteMetaFields.className = 'note-form-fields';
const noteCategoryWrapper = document.createElement('div'); noteCategoryWrapper.className = 'form-field';
const noteCategoryLabel = document.createElement('label'); noteCategoryLabel.htmlFor = 'note-category'; noteCategoryLabel.textContent = 'Categoría';
const noteCategory = document.createElement('select'); noteCategory.id = 'note-category';
[['academico', 'Académico'], ['docentes', 'Docentes'], ['comunidades', 'Comunidades'], ['administrativo', 'Administrativo'], ['personal', 'Personal']].forEach(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; noteCategory.append(option); });
noteCategoryWrapper.append(noteCategoryLabel, noteCategory);
const noteDueWrapper = document.createElement('div'); noteDueWrapper.className = 'form-field';
const noteDueLabel = document.createElement('label'); noteDueLabel.htmlFor = 'note-due-date'; noteDueLabel.textContent = 'Fecha límite (opcional)';
const noteDueDate = document.createElement('input'); noteDueDate.id = 'note-due-date'; noteDueDate.type = 'date'; noteDueWrapper.append(noteDueLabel, noteDueDate);
noteMetaFields.append(noteCategoryWrapper, noteDueWrapper); noteForm.insertBefore(noteMetaFields, noteForm.querySelector('.note-form-footer'));
const noteSearch = document.getElementById('note-search');
const noteCategoryFilter = document.getElementById('note-category-filter');
const noteStatusFilter = document.getElementById('note-status-filter');
const saveNoteButton = document.getElementById('save-note');
const cancelNoteEdit = document.getElementById('cancel-note-edit');
const noteStatus = document.getElementById('note-status');
const noteFormPanel = document.getElementById('note-form-panel');
const toggleNoteFormButton = document.getElementById('toggle-note-form');
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
function createPlanField(id, labelText, type = 'input') {
  const wrapper = document.createElement('div'); wrapper.className = 'form-field';
  const label = document.createElement('label'); label.htmlFor = id; label.textContent = labelText;
  const control = document.createElement(type); control.id = id; wrapper.append(label, control); return { wrapper, control };
}
const planPeriodField = createPlanField('plan-period', 'Periodo académico', 'select');
['2026-II', '2027-I', '2027-II', '2028-I', '2028-II'].forEach((period) => { const option = document.createElement('option'); option.value = period; option.textContent = period; planPeriodField.control.append(option); });
const planGoalField = createPlanField('plan-goal', 'Meta esperada'); planGoalField.control.maxLength = 180; planGoalField.control.placeholder = 'Ej.: Realizar 4 monitoreos';
const planIndicatorField = createPlanField('plan-indicator', 'Indicador'); planIndicatorField.control.maxLength = 180; planIndicatorField.control.placeholder = 'Ej.: Monitoreos ejecutados / programados';
const planProgressField = createPlanField('plan-progress-value', 'Avance (%)'); planProgressField.control.type = 'number'; planProgressField.control.min = '0'; planProgressField.control.max = '100'; planProgressField.control.value = '0';
const planEvidenceField = createPlanField('plan-evidence', 'Enlace de evidencia'); planEvidenceField.control.type = 'url'; planEvidenceField.control.maxLength = 1000; planEvidenceField.control.placeholder = 'https://onedrive...';
const planResultField = createPlanField('plan-result', 'Resultado alcanzado', 'textarea'); planResultField.wrapper.classList.add('plan-result-field'); planResultField.control.maxLength = 500;
[planPeriodField, planGoalField, planIndicatorField, planProgressField, planEvidenceField, planResultField].forEach(({ wrapper }) => planForm.insertBefore(wrapper, planObservations.closest('.form-field')));
const planPeriod = planPeriodField.control; const planGoal = planGoalField.control; const planIndicator = planIndicatorField.control; const planProgressValue = planProgressField.control; const planEvidence = planEvidenceField.control; const planResult = planResultField.control;
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
const planPeriodFilterField = createPlanField('plan-period-filter', 'Periodo', 'select');
['2026-II', '2027-I', '2027-II', '2028-I', '2028-II'].forEach((period) => { const option = document.createElement('option'); option.value = period; option.textContent = period; planPeriodFilterField.control.append(option); });
document.querySelector('.plan-filters').insertBefore(planPeriodFilterField.wrapper, document.querySelector('.plan-filters').firstElementChild);
const planPeriodFilter = planPeriodFilterField.control;
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
const exportBackupButton = document.getElementById('export-backup');
const importBackupButton = document.getElementById('import-backup');
const backupFileInput = document.getElementById('backup-file');
const backupFileName = document.getElementById('backup-file-name');
const backupStatus = document.getElementById('backup-status');
const backupLastExport = document.getElementById('backup-last-export');
const backupFileDetails = document.getElementById('backup-file-details');
const backupFileSize = document.getElementById('backup-file-size');
const backupFileDate = document.getElementById('backup-file-date');
const backupLastExportKey = 'sisco-last-backup-export';
let selectedBackupFile = null;
const communicationFeedback = document.getElementById('communication-feedback');
const communicationCopyButtons = document.querySelectorAll('[data-copy-link]');
const communityCards = document.getElementById('community-cards');
const communityActivitiesBody = document.getElementById('community-activities-body');
const emptyCommunityActivities = document.getElementById('empty-community-activities');
const communityFormPanel = document.getElementById('community-form-panel');
const communityActivityForm = document.getElementById('community-activity-form');
const editingCommunityActivityId = document.getElementById('editing-community-activity-id');
const activityCommunity = document.getElementById('activity-community');
const communityActivityName = document.getElementById('community-activity-name');
const communityActivityType = document.getElementById('community-activity-type');
const communityActivityResponsible = document.getElementById('community-activity-responsible');
const communityActivityDate = document.getElementById('community-activity-date');
const communityActivityStart = document.getElementById('community-activity-start');
const communityActivityEnd = document.getElementById('community-activity-end');
const communityActivityEnvironment = document.getElementById('community-activity-environment');
const communityActivityParticipants = document.getElementById('community-activity-participants');
const communityActivityStatus = document.getElementById('community-activity-status');
const communityActivityEvidence = document.getElementById('community-activity-evidence');
const communityActivityObjective = document.getElementById('community-activity-objective');
const evidenceInputs = ['sheet', 'attendance', 'photos', 'material', 'result'].map((key) => document.getElementById(`evidence-${key}`));
const communityActivityMessage = document.getElementById('community-activity-message');
const saveCommunityActivityButton = document.getElementById('save-community-activity');
const communityFilter = document.getElementById('community-filter');
const communityStatusFilter = document.getElementById('community-status-filter');
const communityPeriod = document.getElementById('community-period');
const communityStorageKey = 'sisco-community-activities';
const communityMembersStorageKey = 'sisco-community-members';
const communityPeriodStorageKey = 'sisco-community-period';
communityPeriod.value = localStorage.getItem(communityPeriodStorageKey) || '2026-II';
let communityActivities = loadCommunityActivities();
let communityMembers = loadCommunityMembers();
let attendanceActivityId = '';
let selectedCommunityMembersFile = null;
let calendarViewDate = new Date();

communicationCopyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyLink);
      communicationFeedback.textContent = 'Enlace de invitación copiado al portapapeles.';
      const originalText = button.textContent;
      button.textContent = '✓ Copiado';
      window.setTimeout(() => { button.textContent = originalText; }, 1800);
    } catch {
      communicationFeedback.textContent = 'No se pudo copiar automáticamente. Abre el grupo para compartir su enlace.';
    }
  });
});

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

  const resourceIcons = { 'Foros': '💬', 'Notas': '🧾', 'Tickets de Atención': '🎫', 'UTP+Class': '🎓', 'Portal Coordinador': '🧭', 'Portal Docente': '👨‍🏫', 'PeopleSoft': '🏢', 'Horacio': '📅', 'ChatGPT': '✨', 'Docentes': '👥', 'Sustentaciones': '🎤', 'EVA': '📝', 'Sílabos de cursos': '📚', 'Convalidaciones': '📁', 'Metodología de enseñanza': '📈', 'Docente Apto - Assessment': '✅' };
  const top = document.createElement('div'); top.className = 'system-card-top';
  const icon = document.createElement('span'); icon.className = 'system-card-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = resourceIcons[system.name] || '🔗';
  const status = document.createElement('span'); status.className = `system-status ${system.unavailable ? 'pending' : 'available'}`; status.textContent = system.unavailable ? 'Pendiente' : 'Disponible';
  top.append(icon, status);
  const content = document.createElement('div'); content.className = 'system-card-content';
  const title = document.createElement('h3');
  title.textContent = system.name;
  const description = document.createElement('p');
  description.textContent = system.description;
  content.append(title, description);
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
    link.innerHTML = 'Abrir recurso <span aria-hidden="true">↗</span>';
    link.setAttribute('aria-label', `Abrir ${system.name} en una nueva pestaña`);
  }

  card.append(top, content, link);
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

function filterAcademicResources() {
  const query = normalizeSearchText(resourceSearch.value.trim());
  let visibleCount = 0;
  document.querySelectorAll('.system-card').forEach((card) => {
    const visible = !query || card.dataset.search.includes(query);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.querySelectorAll('[data-resource-group]').forEach((group) => {
    const visibleCards = group.querySelectorAll('.system-card:not([hidden])').length;
    group.hidden = visibleCards === 0;
    const counter = group.querySelector('.resource-count');
    counter.textContent = `${visibleCards} ${visibleCards === 1 ? 'recurso' : 'recursos'}`;
  });
  resourceResults.textContent = `${visibleCount} ${visibleCount === 1 ? 'recurso encontrado' : 'recursos encontrados'}`;
  resourcesEmpty.hidden = visibleCount !== 0;
}

resourceSearch.addEventListener('input', filterAcademicResources);

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
    employeeId: teacher.employeeId || '',
    email: teacher.email || '',
    condition: teacher.condition || 'tiempo-parcial',
    specialty: teacher.specialty || '',
    certifications: teacher.certifications || '',
    coordinationObservations: teacher.coordinationObservations || '',
    schedule: Array.isArray(teacher.schedule) ? teacher.schedule : [],
    scheduleHeaders: Array.isArray(teacher.scheduleHeaders) ? teacher.scheduleHeaders : [],
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
    return Array.isArray(savedNotes) ? savedNotes.map((note) => ({ ...note, category: note.category || 'academico', dueDate: note.dueDate || '' })) : [];
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
    return Array.isArray(savedPlanItems) ? savedPlanItems.map((item) => ({ ...item, period: item.period || '2026-II', goal: item.goal || '', indicator: item.indicator || '', result: item.result || '', progress: Number(item.progress) || (item.status === 'completado' ? 100 : 0), evidence: item.evidence || '' })) : [];
  } catch {
    return [];
  }
}

function savePlanItems() {
  localStorage.setItem(planStorageKey, JSON.stringify(planItems));
}

function loadCommunityActivities() {
  try {
    const saved = JSON.parse(localStorage.getItem(communityStorageKey));
    return Array.isArray(saved) ? saved.map((activity) => ({ ...activity, period: activity.period || '2026-II' })) : [];
  } catch {
    return [];
  }
}

function saveCommunityActivities() {
  localStorage.setItem(communityStorageKey, JSON.stringify(communityActivities));
}

function loadCommunityMembers() {
  try {
    const saved = JSON.parse(localStorage.getItem(communityMembersStorageKey));
    return Array.isArray(saved) ? saved.map((member) => ({ ...member, period: member.period || '2026-II' })) : [];
  } catch {
    return [];
  }
}

function saveCommunityMembers() {
  localStorage.setItem(communityMembersStorageKey, JSON.stringify(communityMembers));
}

function spreadsheetKey(value) {
  return normalizeSearchText(String(value || '')).replace(/[^a-z0-9]/g, '');
}

function downloadCommunityMembersTemplate() {
  if (!window.XLSX) { document.getElementById('community-member-message').textContent = 'No se pudo cargar el componente de Excel. Verifica tu conexión e inténtalo nuevamente.'; return; }
  const rows = [
    { Código: 'U202012345', 'Nombres y apellidos': 'María López García', Correo: 'u202012345@utp.edu.pe', Teléfono: '987654321', Ciclo: 'VI', Comunidad: 'Infrastructure & Cybersecurity', Rol: 'Líder estudiantil', Estado: 'Activo', Periodo: communityPeriod.value },
    { Código: 'U202145678', 'Nombres y apellidos': 'Carlos Ramos Díaz', Correo: 'u202145678@utp.edu.pe', Teléfono: '956123789', Ciclo: 'V', Comunidad: 'UTP Developer Community', Rol: 'Miembro', Estado: 'Inscrito', Periodo: communityPeriod.value }
  ];
  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet['!cols'] = [{ wch: 16 }, { wch: 30 }, { wch: 28 }, { wch: 14 }, { wch: 10 }, { wch: 34 }, { wch: 22 }, { wch: 14 }, { wch: 12 }];
  const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, sheet, 'Estudiantes');
  XLSX.writeFile(workbook, 'Plantilla_Estudiantes_Comunidades_2026-2.xlsx');
}

function normalizeImportedCommunity(value) {
  const key = spreadsheetKey(value);
  if (['utpdevelopercommunity', 'developer', 'desarrollo'].includes(key)) return 'developer';
  if (['infrastructurecybersecurity', 'infraestructurayciberseguridad', 'infraestructura', 'ciberseguridad'].includes(key)) return 'infrastructure';
  if (['utpinnovationlab', 'innovationlab', 'innovacion'].includes(key)) return 'innovation';
  return '';
}

function normalizeImportedRole(value) {
  const key = spreadsheetKey(value);
  if (['miembro'].includes(key)) return 'miembro';
  if (['equipoorganizador', 'organizador'].includes(key)) return 'organizador';
  if (['liderestudiantil', 'lider'].includes(key)) return 'lider';
  return '';
}

function normalizeImportedMemberStatus(value) {
  const key = spreadsheetKey(value);
  return ['inscrito', 'activo', 'inactivo', 'retirado'].includes(key) ? key : '';
}

function normalizeAcademicPeriod(value) {
  const period = String(value || communityPeriod.value).trim().toUpperCase().replace(/\s/g, '');
  return /^20\d{2}-(I|II)$/.test(period) ? period : '';
}

async function importCommunityMembersExcel() {
  const message = document.getElementById('community-member-message');
  if (!selectedCommunityMembersFile) return;
  if (!window.XLSX) { message.textContent = 'No se pudo cargar el componente de Excel. Verifica tu conexión e inténtalo nuevamente.'; return; }
  try {
    const workbook = XLSX.read(await selectedCommunityMembersFile.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    if (!rows.length) throw new Error('La primera hoja del archivo no contiene estudiantes.');
    let created = 0; let updated = 0; let omitted = 0; const errors = [];
    rows.forEach((source, index) => {
      const row = Object.fromEntries(Object.entries(source).map(([key, value]) => [spreadsheetKey(key), String(value).trim()]));
      const code = row.codigo || row.codigoutp || '';
      const name = row.nombresyapellidos || row.nombrecompleto || row.estudiante || '';
      const community = normalizeImportedCommunity(row.comunidad);
      const role = normalizeImportedRole(row.rol || 'Miembro');
      const status = normalizeImportedMemberStatus(row.estado || 'Inscrito');
      const period = normalizeAcademicPeriod(row.periodo);
      if (!code || !name || !community || !role || !status || !period) {
        omitted += 1; errors.push(`Fila ${index + 2}: revisa código, nombre, comunidad, rol, estado y periodo.`); return;
      }
      const existing = communityMembers.find((member) => member.period === period && member.code.toLocaleLowerCase('es-PE') === code.toLocaleLowerCase('es-PE'));
      const member = { ...(existing || {}), id: existing?.id || `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`, period, community, code, name, email: row.correo || row.email || '', phone: row.telefono || row.celular || '', cycle: row.ciclo || '', role, status, createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
      if (existing) { communityMembers = communityMembers.map((item) => item.id === existing.id ? member : item); updated += 1; }
      else { communityMembers.push(member); created += 1; }
    });
    saveCommunityMembers(); renderCommunityMembers(); renderCommunities(); renderBackupSummary();
    message.textContent = `Importación terminada: ${created} nuevos, ${updated} actualizados y ${omitted} omitidos.${errors.length ? ` ${errors.slice(0, 3).join(' ')}` : ''}`;
  } catch (error) {
    message.textContent = `No se pudo importar el archivo: ${error.message}`;
  }
}

function evidenceChecklist(activity) {
  return { sheet: false, attendance: false, photos: false, material: false, result: false, ...(activity.evidenceChecklist || {}) };
}

function evidenceProgress(activity) {
  return Object.values(evidenceChecklist(activity)).filter(Boolean).length;
}

function hasCompleteEvidence(activity) {
  return Boolean(activity.evidence) && evidenceProgress(activity) === 5;
}

function studentParticipationStats(member) {
  const completed = communityActivities.filter((activity) => activity.period === member.period && (activity.community === member.community || activity.community === 'joint') && ['ejecutada', 'evidenciada'].includes(activity.status));
  const attended = completed.filter((activity) => (activity.attendance || []).includes(member.id));
  const percentage = completed.length ? Math.round((attended.length / completed.length) * 100) : 0;
  const completeFiles = attended.length > 0 && attended.every(hasCompleteEvidence);
  const situation = !completed.length ? 'Sin actividad' : percentage >= 80 && completeFiles ? 'Destacado' : percentage >= 50 ? 'Activo' : 'En seguimiento';
  return { completed: completed.length, attended: attended.length, percentage, situation };
}

function closeStudentProfile() {
  document.getElementById('student-profile-dialog').close();
  document.getElementById('student-profile-message').textContent = '';
}

function openStudentProfile(member) {
  const stats = studentParticipationStats(member);
  document.getElementById('student-profile-id').value = member.id;
  document.getElementById('student-profile-title').textContent = member.name;
  document.getElementById('student-profile-subtitle').textContent = `${member.code} · ${communityName(member.community)} · ${member.period}`;
  document.getElementById('student-profile-situation').textContent = stats.situation;
  document.getElementById('student-profile-attendance').textContent = `${stats.percentage}%`;
  document.getElementById('student-profile-participations').textContent = `${stats.attended}/${stats.completed}`;
  document.getElementById('student-profile-mentor').textContent = communityDefinitions.find((community) => community.id === member.community)?.mentor || '—';
  const details = document.getElementById('student-profile-details');
  details.replaceChildren();
  [['Correo', member.email || 'No registrado'], ['Teléfono', member.phone || 'No registrado'], ['Ciclo', member.cycle || 'No registrado'], ['Rol', ({ miembro: 'Miembro', organizador: 'Equipo organizador', lider: 'Líder estudiantil' })[member.role]], ['Estado', member.status], ['Periodo', member.period]].forEach(([label, value]) => {
    const item = document.createElement('div'); const caption = document.createElement('span'); caption.textContent = `${label}: `; const content = document.createElement('strong'); content.textContent = value; item.append(caption, content); details.append(item);
  });
  document.getElementById('student-profile-portfolio').value = member.portfolio || '';
  document.getElementById('student-profile-projects').value = member.projects || '';
  document.getElementById('student-profile-certifications').value = member.certifications || '';
  document.getElementById('student-profile-observations').value = member.mentorObservations || '';
  const history = communityMembers.filter((item) => item.code.toLocaleLowerCase('es-PE') === member.code.toLocaleLowerCase('es-PE')).sort((a, b) => b.period.localeCompare(a.period));
  const historyList = document.createElement('div'); historyList.className = 'profile-history-list';
  history.forEach((record) => { const recordStats = studentParticipationStats(record); const item = document.createElement('div'); item.className = 'profile-history-item'; const description = document.createElement('span'); description.textContent = `${record.period} · ${communityName(record.community)} · ${record.status}`; const result = document.createElement('strong'); result.textContent = `${recordStats.percentage}% · ${recordStats.situation}`; item.append(description, result); historyList.append(item); });
  document.getElementById('student-profile-history').replaceChildren(historyList);
  document.getElementById('student-profile-dialog').showModal();
}

function communityName(id) {
  if (id === 'joint') return 'Actividad conjunta';
  return communityDefinitions.find((community) => community.id === id)?.name || 'Comunidad';
}

function communityStatusLabel(status) {
  return ({ propuesta: 'Propuesta', aprobada: 'Aprobada', reservada: 'Ambiente reservado', ejecutada: 'Ejecutada', evidenciada: 'Evidenciada' })[status] || status;
}

function renderCommunityMembers() {
  const body = document.getElementById('community-members-body');
  const empty = document.getElementById('empty-community-members');
  body.replaceChildren();
  const ordered = communityMembers.filter((member) => member.period === communityPeriod.value).sort((a, b) => a.community.localeCompare(b.community) || a.name.localeCompare(b.name, 'es'));
  empty.hidden = ordered.length > 0;
  empty.textContent = ordered.length ? '' : `Aún no hay estudiantes registrados en ${communityPeriod.value}.`;
  ordered.forEach((member) => {
    const row = document.createElement('tr');
    const communityCell = document.createElement('td'); communityCell.textContent = communityName(member.community);
    const nameCell = document.createElement('td');
    const memberName = document.createElement('strong'); memberName.textContent = member.name;
    const code = document.createElement('small'); code.textContent = `${member.code}${member.cycle ? ` · Ciclo ${member.cycle}` : ''}`; code.style.display = 'block';
    nameCell.append(memberName, code);
    const contactCell = document.createElement('td');
    contactCell.textContent = member.email || 'Sin correo';
    if (member.phone) { const phone = document.createElement('small'); phone.textContent = member.phone; phone.style.display = 'block'; contactCell.append(phone); }
    const roleCell = document.createElement('td'); roleCell.textContent = ({ miembro: 'Miembro', organizador: 'Equipo organizador', lider: 'Líder estudiantil' })[member.role] || member.role;
    const statusCell = document.createElement('td');
    const badge = document.createElement('span'); badge.className = `community-status community-member-${member.status}`; badge.textContent = member.status; statusCell.append(badge);
    const actions = document.createElement('td'); actions.className = 'table-actions';
    const profile = document.createElement('button'); profile.type = 'button'; profile.className = 'table-button'; profile.textContent = 'Ver perfil'; profile.addEventListener('click', () => openStudentProfile(member));
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'table-button'; edit.textContent = 'Editar'; edit.addEventListener('click', () => editCommunityMember(member));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'table-button delete-button'; remove.textContent = 'Eliminar'; remove.addEventListener('click', () => deleteCommunityMember(member.id));
    actions.append(profile, edit, remove); row.append(communityCell, nameCell, contactCell, roleCell, statusCell, actions); body.append(row);
  });
}

function resetCommunityMemberForm() {
  document.getElementById('community-member-form').reset();
  document.getElementById('editing-community-member-id').value = '';
  document.getElementById('save-community-member').textContent = 'Agregar estudiante';
  document.getElementById('cancel-community-member').hidden = true;
}

function editCommunityMember(member) {
  document.getElementById('editing-community-member-id').value = member.id;
  ['community', 'code', 'name', 'email', 'phone', 'cycle', 'role', 'status'].forEach((field) => { document.getElementById(`member-${field}`).value = member[field] || ''; });
  document.getElementById('save-community-member').textContent = 'Guardar cambios';
  document.getElementById('cancel-community-member').hidden = false;
}

function deleteCommunityMember(id) {
  if (!window.confirm('¿Eliminar este estudiante de la comunidad?')) return;
  communityMembers = communityMembers.filter((member) => member.id !== id);
  communityActivities = communityActivities.map((activity) => ({ ...activity, attendance: (activity.attendance || []).filter((memberId) => memberId !== id) }));
  saveCommunityMembers(); saveCommunityActivities(); renderCommunityMembers(); renderCommunities();
}

function renderCommunityAlerts() {
  const list = document.getElementById('community-alerts');
  const today = new Date(`${getToday()}T00:00:00`);
  const alerts = [];
  communityActivities.filter((activity) => activity.period === communityPeriod.value).forEach((activity) => {
    const days = Math.ceil((new Date(`${activity.date}T00:00:00`) - today) / 86400000);
    if (days >= 0 && days <= 7 && ['propuesta', 'aprobada'].includes(activity.status)) alerts.push({ level: 'warning', text: `${activity.name}: faltan ${days} día(s) y el ambiente aún no figura reservado.` });
    if (['ejecutada', 'evidenciada'].includes(activity.status) && !hasCompleteEvidence(activity)) alerts.push({ level: 'danger', text: `${activity.name}: expediente incompleto (${evidenceProgress(activity)}/5 evidencias).` });
  });
  communityDefinitions.forEach((community) => {
    if (!communityActivities.some((activity) => activity.period === communityPeriod.value && activity.community === community.id && activity.date >= getToday() && !['ejecutada', 'evidenciada'].includes(activity.status))) alerts.push({ level: 'info', text: `${community.name}: sin próxima actividad programada en ${communityPeriod.value}.` });
  });
  list.replaceChildren(...alerts.slice(0, 6).map((alert) => { const item = document.createElement('li'); item.className = `community-alert community-alert-${alert.level}`; item.textContent = alert.text; return item; }));
  list.hidden = alerts.length === 0;
}

function renderCommunities() {
  const periodActivities = communityActivities.filter((activity) => activity.period === communityPeriod.value);
  const periodMembers = communityMembers.filter((member) => member.period === communityPeriod.value);
  communityCards.replaceChildren(...communityDefinitions.map((community) => {
    const card = document.createElement('article');
    card.className = 'community-card';
    card.style.setProperty('--community-color', community.color);
    const activities = periodActivities.filter((activity) => activity.community === community.id);
    const members = periodMembers.filter((member) => member.community === community.id && ['inscrito', 'activo'].includes(member.status)).length;
    const executed = activities.filter((activity) => ['ejecutada', 'evidenciada'].includes(activity.status)).length;
    const nextActivity = activities.filter((activity) => activity.date >= getToday() && !['ejecutada', 'evidenciada'].includes(activity.status)).sort((first, second) => first.date.localeCompare(second.date))[0];
    const tag = document.createElement('small');
    tag.textContent = 'COMUNIDAD PILOTO';
    const title = document.createElement('h3');
    title.textContent = community.name;
    const focus = document.createElement('p');
    focus.textContent = community.focus;
    const mentor = document.createElement('p');
    mentor.innerHTML = `<strong>Mentor:</strong> ${community.mentor}`;
    const meta = document.createElement('div');
    meta.className = 'community-card-meta';
    const progress = document.createElement('strong');
    progress.textContent = `${members} estudiantes · ${executed}/${activities.length} ejecutadas`;
    const next = document.createElement('span');
    next.textContent = nextActivity ? `Próxima: ${new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(new Date(`${nextActivity.date}T00:00:00`))}` : 'Sin próxima actividad';
    meta.append(progress, next);
    card.append(tag, title, focus, mentor, meta);
    return card;
  }));

  const executedCount = periodActivities.filter((activity) => ['ejecutada', 'evidenciada'].includes(activity.status)).length;
  const evidenceCount = periodActivities.filter(hasCompleteEvidence).length;
  document.getElementById('community-registered-count').textContent = periodActivities.length;
  document.getElementById('community-executed-count').textContent = executedCount;
  document.getElementById('community-evidence-count').textContent = `${periodActivities.length ? Math.round((evidenceCount / periodActivities.length) * 100) : 0}%`;
  renderCommunityAlerts();

  const visibleActivities = periodActivities
    .filter((activity) => (!communityFilter.value || activity.community === communityFilter.value) && (!communityStatusFilter.value || activity.status === communityStatusFilter.value))
    .sort((first, second) => first.date.localeCompare(second.date));
  communityActivitiesBody.replaceChildren();
  emptyCommunityActivities.hidden = visibleActivities.length > 0;
  emptyCommunityActivities.textContent = periodActivities.length ? 'No hay actividades que coincidan con los filtros.' : `Aún no hay actividades registradas en ${communityPeriod.value}.`;

  visibleActivities.forEach((activity) => {
    const row = document.createElement('tr');
    const activityCell = document.createElement('td');
    activityCell.className = 'plan-task-cell';
    const name = document.createElement('strong');
    name.textContent = activity.name;
    const community = document.createElement('small');
    community.textContent = `${communityName(activity.community)} · ${activity.type}`;
    activityCell.append(name, community);
    const responsibleCell = document.createElement('td');
    responsibleCell.textContent = activity.responsible;
    const dateCell = document.createElement('td');
    dateCell.textContent = `${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${activity.date}T00:00:00`))} · ${activity.start}–${activity.end}`;
    if (activity.environment) {
      const room = document.createElement('small');
      room.textContent = activity.environment;
      room.style.display = 'block';
      dateCell.append(room);
    }
    const participantsCell = document.createElement('td');
    participantsCell.textContent = String(activity.participants || 0);
    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = `community-status community-status-${activity.status}`;
    status.textContent = communityStatusLabel(activity.status);
    statusCell.append(status);
    const evidenceCell = document.createElement('td');
    const evidenceText = document.createElement('small'); evidenceText.textContent = `${evidenceProgress(activity)}/5 requisitos`; evidenceText.style.display = 'block';
    if (activity.evidence) {
      const link = document.createElement('a');
      link.className = 'evidence-link';
      link.href = activity.evidence;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Abrir evidencia';
      evidenceCell.append(link, evidenceText);
    } else {
      evidenceCell.append('Pendiente', evidenceText);
      evidenceCell.className = 'muted-cell';
    }
    const actionsCell = document.createElement('td');
    actionsCell.className = 'table-actions';
    const edit = document.createElement('button');
    edit.className = 'table-button'; edit.type = 'button'; edit.textContent = 'Editar';
    edit.addEventListener('click', () => editCommunityActivity(activity));
    const attendance = document.createElement('button'); attendance.className = 'table-button'; attendance.type = 'button'; attendance.textContent = 'Asistencia'; attendance.addEventListener('click', () => openAttendance(activity));
    const workflow = ['propuesta', 'aprobada', 'reservada', 'ejecutada', 'evidenciada'];
    const advance = document.createElement('button'); advance.className = 'table-button'; advance.type = 'button'; advance.textContent = 'Siguiente estado'; advance.hidden = activity.status === 'evidenciada'; advance.addEventListener('click', () => advanceCommunityActivity(activity.id));
    const remove = document.createElement('button');
    remove.className = 'table-button delete-button'; remove.type = 'button'; remove.textContent = 'Eliminar';
    remove.addEventListener('click', () => deleteCommunityActivity(activity.id));
    actionsCell.append(edit, attendance, advance, remove);
    row.append(activityCell, responsibleCell, dateCell, participantsCell, statusCell, evidenceCell, actionsCell);
    communityActivitiesBody.append(row);
  });
}

function resetCommunityActivityForm() {
  communityActivityForm.reset();
  editingCommunityActivityId.value = '';
  communityActivityParticipants.value = '0';
  evidenceInputs.forEach((input) => { input.checked = false; });
  saveCommunityActivityButton.textContent = 'Guardar actividad';
  communityFormPanel.hidden = true;
}

function editCommunityActivity(activity) {
  editingCommunityActivityId.value = activity.id;
  activityCommunity.value = activity.community;
  communityActivityName.value = activity.name;
  communityActivityType.value = activity.type;
  communityActivityResponsible.value = activity.responsible;
  communityActivityDate.value = activity.date;
  communityActivityStart.value = activity.start;
  communityActivityEnd.value = activity.end;
  communityActivityEnvironment.value = activity.environment || '';
  communityActivityParticipants.value = activity.participants || 0;
  communityActivityStatus.value = activity.status;
  communityActivityEvidence.value = activity.evidence || '';
  communityActivityObjective.value = activity.objective || '';
  const checklist = evidenceChecklist(activity);
  evidenceInputs.forEach((input) => { input.checked = checklist[input.id.replace('evidence-', '')]; });
  saveCommunityActivityButton.textContent = 'Guardar cambios';
  communityFormPanel.hidden = false;
  communityFormPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function advanceCommunityActivity(id) {
  const workflow = ['propuesta', 'aprobada', 'reservada', 'ejecutada', 'evidenciada'];
  const activity = communityActivities.find((item) => item.id === id);
  if (!activity) return;
  const nextStatus = workflow[workflow.indexOf(activity.status) + 1];
  if (!nextStatus) return;
  if (nextStatus === 'evidenciada' && !hasCompleteEvidence(activity)) {
    communityActivityMessage.textContent = 'Completa los cinco requisitos y registra el enlace antes de cerrar el expediente.';
    return;
  }
  activity.status = nextStatus; activity.updatedAt = new Date().toISOString(); saveCommunityActivities(); renderCommunities();
  communityActivityMessage.textContent = `Actividad actualizada a «${communityStatusLabel(nextStatus)}».`;
}

function openAttendance(activity) {
  attendanceActivityId = activity.id;
  document.getElementById('attendance-activity-name').textContent = `${activity.name} · ${communityName(activity.community)}`;
  const eligible = communityMembers.filter((member) => member.period === activity.period && ['inscrito', 'activo'].includes(member.status) && (activity.community === 'joint' || member.community === activity.community));
  const selected = new Set(activity.attendance || []);
  const list = document.getElementById('attendance-list');
  list.replaceChildren(...eligible.map((member) => {
    const label = document.createElement('label'); label.className = 'attendance-item';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = member.id; checkbox.checked = selected.has(member.id);
    const text = document.createElement('span'); text.textContent = `${member.name} (${member.code})`;
    label.append(checkbox, text); return label;
  }));
  document.getElementById('attendance-empty').hidden = eligible.length > 0;
  document.getElementById('save-attendance').disabled = eligible.length === 0;
  document.getElementById('attendance-dialog').showModal();
}

function closeAttendance() {
  document.getElementById('attendance-dialog').close(); attendanceActivityId = '';
}

function deleteCommunityActivity(id) {
  if (!window.confirm('¿Eliminar esta actividad de la comunidad?')) return;
  communityActivities = communityActivities.filter((activity) => activity.id !== id);
  saveCommunityActivities();
  renderCommunities();
  renderBackupSummary();
  communityActivityMessage.textContent = 'Actividad eliminada correctamente.';
}

function renderBackupSummary() {
  document.getElementById('backup-teachers-count').textContent = teachers.length;
  document.getElementById('backup-notes-count').textContent = notes.length;
  document.getElementById('backup-plan-count').textContent = planItems.length;
  document.getElementById('backup-communities-count').textContent = communityActivities.length;
  document.getElementById('backup-community-members-count').textContent = communityMembers.length;
  const lastExport = localStorage.getItem(backupLastExportKey);
  backupLastExport.textContent = lastExport ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastExport)) : 'Aún no realizada';
}

function exportBackup() {
  const backup = {
    application: 'SISCO - Coordinación Académica de Ingeniería de Sistemas',
    version: 6,
    exportedAt: new Date().toISOString(),
    data: { teachers, notes, planItems, communityActivities, communityMembers }
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `sisco-respaldo-${getToday()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
  localStorage.setItem(backupLastExportKey, backup.exportedAt);
  renderBackupSummary();
  backupStatus.textContent = 'Respaldo descargado correctamente.';
}

function normalizeBackup(backup) {
  if (!backup || backup.application !== 'SISCO - Coordinación Académica de Ingeniería de Sistemas' || !backup.data) throw new Error('El archivo no corresponde a un respaldo válido de SISCO.');
  const importedTeachers = Array.isArray(backup.data.teachers) ? backup.data.teachers.filter((teacher) => teacher && teacher.code && teacher.firstNames && teacher.lastNames).map(normalizeTeacherStatus) : [];
  const importedNotes = Array.isArray(backup.data.notes) ? backup.data.notes.filter((note) => note && note.id && typeof note.text === 'string').map((note) => ({ ...note, category: note.category || 'academico', dueDate: note.dueDate || '' })) : [];
  const importedPlanItems = Array.isArray(backup.data.planItems) ? backup.data.planItems.filter((item) => item && item.id && item.task && item.responsible && item.dueDate).map((item) => ({ ...item, period: item.period || '2026-II', goal: item.goal || '', indicator: item.indicator || '', result: item.result || '', progress: Number(item.progress) || (item.status === 'completado' ? 100 : 0), evidence: item.evidence || '' })) : [];
  const importedCommunityActivities = Array.isArray(backup.data.communityActivities) ? backup.data.communityActivities.filter((item) => item && item.id && item.community && item.name && item.date).map((item) => ({ ...item, period: item.period || '2026-II' })) : [];
  const importedCommunityMembers = Array.isArray(backup.data.communityMembers) ? backup.data.communityMembers.filter((item) => item && item.id && item.community && item.code && item.name).map((item) => ({ ...item, period: item.period || '2026-II' })) : [];
  return { importedTeachers, importedNotes, importedPlanItems, importedCommunityActivities, importedCommunityMembers };
}

async function importBackup() {
  if (!selectedBackupFile) return;
  try {
    const backup = JSON.parse(await selectedBackupFile.text());
    const { importedTeachers, importedNotes, importedPlanItems, importedCommunityActivities, importedCommunityMembers } = normalizeBackup(backup);
    const message = `Se restaurarán ${importedTeachers.length} docentes, ${importedNotes.length} notas, ${importedPlanItems.length} actividades del plan, ${importedCommunityActivities.length} actividades de comunidades y ${importedCommunityMembers.length} estudiantes. Los datos actuales serán reemplazados. ¿Deseas continuar?`;
    if (!window.confirm(message)) return;
    teachers = importedTeachers;
    notes = importedNotes;
    planItems = importedPlanItems;
    communityActivities = importedCommunityActivities;
    communityMembers = importedCommunityMembers;
    localStorage.setItem(teachersSeededKey, 'true');
    saveTeachers();
    saveNotes();
    savePlanItems();
    saveCommunityActivities();
    saveCommunityMembers();
    renderTeachers();
    renderNotes();
    renderPlan();
    renderCommunities();
    renderCommunityMembers();
    renderDashboardAlerts();
    renderDashboardCalendar();
    renderBackupSummary();
    backupStatus.textContent = 'Respaldo restaurado correctamente.';
    backupFileInput.value = '';
    backupFileName.textContent = 'Ningún archivo seleccionado';
    backupFileDetails.hidden = true;
    importBackupButton.disabled = true;
    selectedBackupFile = null;
  } catch (error) {
    backupStatus.textContent = error instanceof SyntaxError ? 'No se pudo leer el archivo JSON seleccionado.' : error.message;
  }
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
  planPeriod.value = planPeriodFilter.value;
  planProgressValue.value = '0';
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
  const periodItems = planItems.filter((item) => item.period === planPeriodFilter.value);
  const counts = {
    total: periodItems.length,
    pending: periodItems.filter((item) => item.status === 'pendiente').length,
    progress: periodItems.filter((item) => item.status === 'en-proceso').length,
    completed: periodItems.filter((item) => item.status === 'completado').length,
    overdue: periodItems.filter(isOverdue).length
  };
  document.getElementById('plan-total').textContent = counts.total;
  document.getElementById('plan-pending').textContent = counts.pending;
  document.getElementById('plan-progress').textContent = counts.progress;
  document.getElementById('plan-completed').textContent = counts.completed;
  document.getElementById('plan-overdue').textContent = counts.overdue;
  const completionPercentage = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  document.getElementById('plan-completion-progress').value = completionPercentage;
  document.getElementById('plan-completion-label').textContent = `${completionPercentage}%`;
}

function getFilteredPlanItems() {
  return planItems.filter((item) => {
    const itemAxis = item.axis || 'sin-eje';
    return item.period === planPeriodFilter.value
      && (!planAxisFilter.value || itemAxis === planAxisFilter.value)
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
  emptyPlan.textContent = planItems.some((item) => item.period === planPeriodFilter.value)
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
    const description = document.createElement('small');
    description.textContent = [item.goal ? `Meta: ${item.goal}` : '', item.indicator ? `Indicador: ${item.indicator}` : '', item.result ? `Resultado: ${item.result}` : '', item.observations || ''].filter(Boolean).join('\n') || 'Sin información adicional';
    taskCell.append(description);
    if (item.evidence) { const evidence = document.createElement('a'); evidence.className = 'evidence-link plan-evidence-link'; evidence.href = item.evidence; evidence.target = '_blank'; evidence.rel = 'noopener noreferrer'; evidence.textContent = 'Ver evidencia'; taskCell.append(evidence); }
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
    const progress = document.createElement('small'); progress.className = 'plan-row-progress'; progress.textContent = `${item.progress || 0}% de avance`;
    const meter = document.createElement('progress'); meter.className = 'plan-row-meter'; meter.max = 100; meter.value = item.progress || 0;
    statusCell.append(statusPill, progress, meter);
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
  planPeriod.value = item.period || '2026-II';
  planGoal.value = item.goal || '';
  planIndicator.value = item.indicator || '';
  planProgressValue.value = item.progress || 0;
  planEvidence.value = item.evidence || '';
  planResult.value = item.result || '';
  planObservations.value = item.observations;
  savePlanItem.textContent = 'Guardar cambios';
  cancelPlanEdit.hidden = false;
  planStatusMessage.textContent = `Editando la actividad “${item.task}”.`;
  planTask.focus();
}

function completePlanItem(id) {
  const item = planItems.find((entry) => entry.id === id);
  if (!item?.evidence) { startPlanEdit(item); planStatusMessage.textContent = 'Registra el enlace de evidencia antes de completar la actividad.'; planEvidence.focus(); return; }
  planItems = planItems.map((entry) => entry.id === id ? { ...entry, status: 'completado', progress: 100 } : entry);
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
  setTeacherManagementPanel(true);
  teacherCode.focus();
}

function setTeacherManagementPanel(open) {
  teacherManagementPanel.hidden = !open;
  toggleTeacherFormButton.setAttribute('aria-expanded', String(open));
  toggleTeacherFormButton.textContent = open ? '× Cerrar formulario' : '＋ Registrar docente';
  if (open) window.setTimeout(() => teacherCode.focus(), 0);
}

function teacherConditionLabel(value) {
  return ({ 'tiempo-parcial': 'Tiempo parcial', 'tiempo-completo': 'Tiempo completo', coordinador: 'Coordinador' })[value] || 'Tiempo parcial';
}

function matchTeacherForSheet(sheetName) {
  const sheetKey = normalizeSearchText(sheetName).replace(/[^a-z0-9]/g, ' ');
  const ranked = teachers.map((teacher) => {
    if (sheetKey.includes(normalizeSearchText(teacher.code))) return { teacher, score: 100 };
    const tokens = normalizeSearchText(`${teacher.firstNames} ${teacher.lastNames}`).split(/\s+/).filter((token) => token.length > 2);
    return { teacher, score: tokens.filter((token) => sheetKey.includes(token)).length };
  }).sort((a, b) => b.score - a.score);
  return ranked[0]?.score >= 2 && ranked[0].score > (ranked[1]?.score || 0) ? ranked[0].teacher : null;
}

function parseTeacherScheduleSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false }).map((row) => row.map((cell) => String(cell).trim()));
  const useful = rows.filter((row) => row.some(Boolean));
  if (!useful.length) return { headers: [], rows: [] };
  const keywords = ['curso', 'asignatura', 'dia', 'día', 'hora', 'inicio', 'fin', 'aula', 'seccion', 'sección', 'modalidad', 'sede'];
  let headerIndex = 0; let bestScore = -1;
  useful.slice(0, 20).forEach((row, index) => { const score = row.filter((cell) => keywords.some((keyword) => normalizeSearchText(cell).includes(normalizeSearchText(keyword)))).length; if (score > bestScore) { bestScore = score; headerIndex = index; } });
  const lastColumn = Math.max(...useful.slice(headerIndex).map((row) => row.reduce((last, cell, index) => cell ? index : last, -1))) + 1;
  const headers = useful[headerIndex].slice(0, lastColumn).map((header, index) => header || `Columna ${index + 1}`);
  const dataRows = useful.slice(headerIndex + 1).map((row) => row.slice(0, lastColumn)).filter((row) => row.some(Boolean));
  return { headers, rows: dataRows };
}

function getTeacherScheduleStats(teacher) {
  const keys = teacher.scheduleHeaders.map(spreadsheetKey);
  const courseIndex = keys.indexOf('curso'); const startIndex = keys.indexOf('horainicio'); const endIndex = keys.indexOf('horafin');
  const courses = new Set(teacher.schedule.map((row) => row[courseIndex]).filter(Boolean));
  const minutes = teacher.schedule.reduce((total, row) => {
    const [startHour, startMinute] = String(row[startIndex] || '').split(':').map(Number); const [endHour, endMinute] = String(row[endIndex] || '').split(':').map(Number);
    if (![startHour, startMinute, endHour, endMinute].every(Number.isFinite)) return total;
    return total + Math.max(0, endHour * 60 + endMinute - startHour * 60 - startMinute);
  }, 0);
  return { courses: courses.size, sessions: teacher.schedule.length, hours: Math.round((minutes / 45) * 10) / 10 };
}

async function importTeacherSchedules() {
  if (!selectedTeacherScheduleFile || !window.XLSX) { setFormStatus('No se pudo abrir el componente de Excel. Verifica tu conexión.'); return; }
  try {
    const workbook = XLSX.read(await selectedTeacherScheduleFile.arrayBuffer(), { type: 'array' });
    const periodMatch = selectedTeacherScheduleFile.name.match(/(20\d{2})[^0-9]?([12])/);
    const importedPeriod = periodMatch ? `${periodMatch[1]}-${periodMatch[2] === '1' ? 'I' : 'II'}` : '2026-II';
    const groupedSchedules = new Map(); const unmatched = []; let createdTeachers = 0;
    workbook.SheetNames.forEach((sheetName) => {
      const parsed = parseTeacherScheduleSheet(workbook.Sheets[sheetName]);
      if (!parsed.rows.length) { unmatched.push(sheetName); return; }
      const keys = parsed.headers.map(spreadsheetKey);
      const codeIndex = keys.indexOf('codigoutp');
      const nameIndex = keys.indexOf('docente');
      const idIndex = keys.indexOf('iddocente');
      if (codeIndex >= 0) {
        const visibleIndexes = keys.map((key, index) => ({ key, index })).filter(({ key }) => !['iddocente', 'codigoutp', 'docente'].includes(key)).map(({ index }) => index);
        parsed.rows.forEach((row, rowIndex) => {
          const code = String(row[codeIndex] || '').trim().toUpperCase();
          if (!code) { unmatched.push(`${sheetName}, fila ${rowIndex + 2}`); return; }
          let teacher = teachers.find((item) => item.code.toUpperCase() === code);
          if (!teacher) {
            const [lastNames = '', firstNames = ''] = String(row[nameIndex] || '').split(',').map((value) => value.trim());
            teacher = normalizeTeacherStatus({ code, firstNames: firstNames || 'NOMBRES PENDIENTES', lastNames: lastNames || 'APELLIDOS PENDIENTES', employeeId: row[idIndex] || '', active: true });
            teachers.push(teacher); createdTeachers += 1;
          }
          if (!groupedSchedules.has(code)) groupedSchedules.set(code, { teacher, headers: visibleIndexes.map((index) => parsed.headers[index]), rows: [], sheetNames: new Set() });
          const group = groupedSchedules.get(code); group.rows.push(visibleIndexes.map((index) => row[index])); group.sheetNames.add(sheetName);
          if (!teacher.employeeId && idIndex >= 0) teacher.employeeId = row[idIndex] || '';
        });
      } else {
        const teacher = matchTeacherForSheet(sheetName);
        if (!teacher) { unmatched.push(sheetName); return; }
        groupedSchedules.set(teacher.code.toUpperCase(), { teacher, headers: parsed.headers, rows: parsed.rows, sheetNames: new Set([sheetName]) });
      }
    });
    const dayOrder = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 7 };
    groupedSchedules.forEach((group) => {
      const dayIndex = group.headers.findIndex((header) => spreadsheetKey(header) === 'dia');
      const startIndex = group.headers.findIndex((header) => spreadsheetKey(header) === 'horainicio');
      group.rows.sort((a, b) => (dayOrder[normalizeSearchText(String(a[dayIndex] || ''))] || 8) - (dayOrder[normalizeSearchText(String(b[dayIndex] || ''))] || 8) || String(a[startIndex] || '').localeCompare(String(b[startIndex] || '')));
      group.teacher.scheduleHeaders = group.headers; group.teacher.schedule = group.rows; group.teacher.scheduleSheet = [...group.sheetNames].join(', '); group.teacher.schedulePeriod = importedPeriod; group.teacher.updatedAt = new Date().toISOString();
    });
    saveTeachers(); renderTeachers();
    renderDailySummary();
    setFormStatus(`Carga lectiva ${importedPeriod} importada para ${groupedSchedules.size} docente(s). ${createdTeachers} docente(s) nuevo(s) fueron creados.${unmatched.length ? ` Registros no asociados: ${unmatched.slice(0, 5).join(', ')}${unmatched.length > 5 ? '…' : ''}.` : ''}`);
  } catch (error) { setFormStatus(`No se pudo importar el horario: ${error.message}`); }
}

function openTeacherProfile(teacher) {
  const scheduleStats = getTeacherScheduleStats(teacher);
  document.getElementById('teacher-profile-title').textContent = `${teacher.firstNames} ${teacher.lastNames}`;
  document.getElementById('teacher-profile-subtitle').textContent = `${teacher.code} · ${teacherConditionLabel(teacher.condition)}`;
  document.getElementById('teacher-profile-dialog').dataset.teacherCode = teacher.code;
  const summary = document.getElementById('teacher-profile-summary'); summary.replaceChildren();
  [['Estado', teacher.active === false ? 'Inactivo' : 'Activo'], ['Carga lectiva', `${scheduleStats.hours} h pedagógicas`], ['Cursos', String(scheduleStats.courses)], ['Periodo', teacher.schedulePeriod || 'Sin horario']].forEach(([label, value]) => { const card = document.createElement('article'); const small = document.createElement('span'); small.textContent = label; const strong = document.createElement('strong'); strong.textContent = value; card.append(small, strong); summary.append(card); });
  const details = document.getElementById('teacher-profile-details'); details.replaceChildren();
  [['ID docente', teacher.employeeId || 'No registrado'], ['Correo', teacher.email || 'No registrado'], ['Teléfono', teacher.phone || 'No registrado'], ['Especialidad', teacher.specialty || 'No registrada'], ['Certificaciones', teacher.certifications || 'No registradas']].forEach(([label, value]) => { const item = document.createElement('div'); const small = document.createElement('span'); small.textContent = label; const content = document.createElement('strong'); content.textContent = value; item.append(small, content); details.append(item); });
  document.getElementById('teacher-profile-observations').value = teacher.coordinationObservations || '';
  document.getElementById('teacher-profile-message').textContent = '';
  document.getElementById('teacher-profile-dialog').showModal();
}

function renderTeachers() {
  teachersTableBody.replaceChildren();
  const query = normalizeSearchText(teacherFilter.value.trim());
  const filteredTeachers = teachers.filter((teacher) => {
    const searchableText = normalizeSearchText(`${teacher.employeeId || ''} ${teacher.code} ${teacher.firstNames} ${teacher.lastNames} ${teacher.phone || ''} ${teacher.email || ''} ${teacher.specialty || ''}`);
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
      groupCell.colSpan = 7;
      groupCell.scope = 'rowgroup';
      groupCell.textContent = teacherGroup === 'active'
        ? `Docentes activos (${groupCounts.active})`
        : `Docentes inactivos (${groupCounts.inactive})`;
      groupRow.append(groupCell);
      teachersTableBody.append(groupRow);
    }
    const row = document.createElement('tr');
    row.className = `teacher-row ${teacherGroup}`;
    const idCell = document.createElement('td');
    idCell.textContent = teacher.employeeId || 'Sin registrar';
    if (!teacher.employeeId) idCell.className = 'muted-cell';
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
    row.append(idCell, codeCell, firstNamesCell, lastNamesCell, phoneCell, statusCell);

    const actionsCell = document.createElement('td');
    actionsCell.className = 'table-actions teacher-actions';
    const scheduleButton = document.createElement('button');
    scheduleButton.className = 'table-button schedule-button';
    scheduleButton.type = 'button';
    scheduleButton.textContent = 'Horario';
    scheduleButton.addEventListener('click', () => showTeacherSchedule(teacher));
    const profileButton = document.createElement('button'); profileButton.className = 'table-button'; profileButton.type = 'button'; profileButton.textContent = 'Perfil'; profileButton.addEventListener('click', () => openTeacherProfile(teacher));
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
    actionsCell.append(profileButton, scheduleButton, editButton, deleteButton);
    row.append(actionsCell);
    teachersTableBody.append(row);
  });
}

function showTeacherSchedule(teacher) {
  scheduleTitle.textContent = `${teacher.firstNames} ${teacher.lastNames}`;
  scheduleTeacherCode.textContent = `Código docente: ${teacher.code}`;
  const empty = document.getElementById('schedule-empty');
  const content = document.getElementById('teacher-schedule-content');
  const hasSchedule = teacher.schedule.length > 0;
  empty.hidden = hasSchedule; content.hidden = !hasSchedule;
  document.getElementById('print-teacher-schedule').disabled = !hasSchedule;
  if (hasSchedule) {
    const stats = getTeacherScheduleStats(teacher);
    document.getElementById('schedule-print-teacher-name').textContent = `${teacher.lastNames}, ${teacher.firstNames}`;
    document.getElementById('schedule-print-teacher-code').textContent = `Código UTP: ${teacher.code}${teacher.employeeId ? ` · ID docente: ${teacher.employeeId}` : ''}`;
    document.getElementById('schedule-print-period').textContent = teacher.schedulePeriod || '2026-II';
    document.getElementById('schedule-print-date').textContent = `Emitido el ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date())}`;
    const summary = document.getElementById('teacher-schedule-summary'); summary.replaceChildren();
    [['Cursos', stats.courses], ['Sesiones', stats.sessions], ['Horas pedagógicas', stats.hours], ['Periodo', teacher.schedulePeriod || '2026-II']].forEach(([label, value]) => { const card = document.createElement('article'); const strong = document.createElement('strong'); strong.textContent = value; const span = document.createElement('span'); span.textContent = label; card.append(strong, span); summary.append(card); });
    const keys = teacher.scheduleHeaders.map(spreadsheetKey);
    const columnIndex = (...names) => names.map((name) => keys.indexOf(name)).find((index) => index >= 0) ?? -1;
    const indexes = { course: columnIndex('curso', 'asignatura'), shift: columnIndex('turno'), cycle: columnIndex('ciclo'), mode: columnIndex('modoensenanza', 'modalidad'), day: columnIndex('dia'), start: columnIndex('horainicio'), end: columnIndex('horafin'), room: columnIndex('instalacion', 'aula') };
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const weekly = document.getElementById('teacher-weekly-schedule'); weekly.replaceChildren();
    const activeDays = days.map((day) => ({ day, sessions: teacher.schedule.filter((row) => normalizeSearchText(String(row[indexes.day] || '')) === normalizeSearchText(day)) })).filter(({ sessions }) => sessions.length);
    weekly.style.setProperty('--schedule-day-count', activeDays.length || 1);
    activeDays.forEach(({ day, sessions }) => {
      const column = document.createElement('section'); column.className = 'schedule-day';
      const heading = document.createElement('div'); heading.className = 'schedule-day-heading'; const title = document.createElement('h3'); title.textContent = day; const count = document.createElement('span'); count.textContent = `${sessions.length} sesión${sessions.length === 1 ? '' : 'es'}`; heading.append(title, count); column.append(heading);
      sessions.forEach((row) => {
        const session = document.createElement('article'); const mode = String(row[indexes.mode] || 'Sin modalidad'); session.className = `schedule-session ${normalizeSearchText(mode).includes('remoto') ? 'remote-session' : 'onsite-session'}`;
        const time = document.createElement('time'); time.textContent = `${row[indexes.start] || '—'} – ${row[indexes.end] || '—'}`;
        const course = document.createElement('strong'); course.textContent = row[indexes.course] || 'Curso sin nombre';
        const meta = document.createElement('div'); meta.className = 'schedule-session-meta';
        [mode, row[indexes.room] ? `Aula ${row[indexes.room]}` : '', row[indexes.cycle] ? `Ciclo ${row[indexes.cycle]}` : '', row[indexes.shift] ? `Turno ${row[indexes.shift]}` : ''].filter(Boolean).forEach((value) => { const tag = document.createElement('span'); tag.textContent = value; meta.append(tag); });
        session.append(time, course, meta); column.append(session);
      });
      weekly.append(column);
    });
    const headRow = document.createElement('tr'); teacher.scheduleHeaders.forEach((header) => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = header; headRow.append(th); }); document.getElementById('teacher-schedule-head').replaceChildren(headRow);
    const body = document.getElementById('teacher-schedule-body'); body.replaceChildren(); teacher.schedule.forEach((values) => { const row = document.createElement('tr'); teacher.scheduleHeaders.forEach((header, index) => { const cell = document.createElement('td'); cell.textContent = values[index] || '—'; row.append(cell); }); body.append(row); });
  }
  scheduleDialog.showModal();
}

function closeTeacherSchedule() {
  scheduleDialog.close();
}

closeScheduleButton.addEventListener('click', closeTeacherSchedule);
closeScheduleFooterButton.addEventListener('click', closeTeacherSchedule);
document.getElementById('print-teacher-schedule').addEventListener('click', () => window.print());
scheduleDialog.addEventListener('click', (event) => {
  if (event.target === scheduleDialog) closeTeacherSchedule();
});
teacherScheduleFile.addEventListener('change', () => {
  selectedTeacherScheduleFile = teacherScheduleFile.files[0] || null;
  document.getElementById('teacher-schedule-file-name').textContent = selectedTeacherScheduleFile ? selectedTeacherScheduleFile.name : 'Ningún archivo seleccionado';
  importTeacherSchedulesButton.disabled = !selectedTeacherScheduleFile;
});
importTeacherSchedulesButton.addEventListener('click', importTeacherSchedules);
document.getElementById('close-teacher-profile').addEventListener('click', () => document.getElementById('teacher-profile-dialog').close());
document.getElementById('close-teacher-profile-footer').addEventListener('click', () => document.getElementById('teacher-profile-dialog').close());
document.getElementById('save-teacher-profile').addEventListener('click', () => {
  const dialog = document.getElementById('teacher-profile-dialog');
  const teacher = teachers.find((item) => item.code === dialog.dataset.teacherCode); if (!teacher) return;
  teacher.coordinationObservations = document.getElementById('teacher-profile-observations').value.trim(); teacher.updatedAt = new Date().toISOString(); saveTeachers();
  document.getElementById('teacher-profile-message').textContent = 'Seguimiento guardado correctamente.';
});

function startEditTeacher(teacher) {
  setTeacherManagementPanel(true);
  editingTeacherCode.value = teacher.code;
  teacherCode.value = teacher.code;
  teacherId.value = teacher.employeeId || '';
  teacherCode.disabled = true;
  teacherFirstNames.value = teacher.firstNames;
  teacherLastNames.value = teacher.lastNames;
  teacherPhone.value = teacher.phone || '';
  teacherEmail.value = teacher.email || '';
  teacherCondition.value = teacher.condition || 'tiempo-parcial';
  teacherSpecialty.value = teacher.specialty || '';
  teacherCertifications.value = teacher.certifications || '';
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
  const isOverdueNote = (note) => !note.completed && note.dueDate && note.dueDate < getToday();
  const query = normalizeSearchText(noteSearch.value.trim());
  const visibleNotes = notes.filter((note) => {
    const status = noteStatusFilter.value;
    const statusMatch = !status || (status === 'abierta' && !note.completed) || (status === 'urgente' && note.urgent && !note.completed) || (status === 'vencida' && isOverdueNote(note)) || (status === 'completada' && note.completed);
    return (!query || normalizeSearchText(note.text).includes(query)) && (!noteCategoryFilter.value || note.category === noteCategoryFilter.value) && statusMatch;
  });
  document.getElementById('notes-open-count').textContent = notes.filter((note) => !note.completed).length;
  document.getElementById('notes-urgent-count').textContent = notes.filter((note) => note.urgent && !note.completed).length;
  document.getElementById('notes-overdue-count').textContent = notes.filter(isOverdueNote).length;
  document.getElementById('notes-completed-count').textContent = notes.filter((note) => note.completed).length;
  emptyNotes.hidden = visibleNotes.length > 0;
  emptyNotes.textContent = notes.length ? 'No hay notas que coincidan con los filtros.' : 'Aún no tienes notas ni pendientes.';

  const groupedNotes = groupNotesByMonthAndDay(visibleNotes);

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
        item.className = `note-item${note.completed ? ' completed' : ''}${note.urgent ? ' urgent' : ''}${isOverdueNote(note) ? ' overdue-note' : ''}`;

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
        const categoryBadge = document.createElement('span'); categoryBadge.className = `note-category-badge note-category-${note.category}`; categoryBadge.textContent = ({ academico: 'Académico', docentes: 'Docentes', comunidades: 'Comunidades', administrativo: 'Administrativo', personal: 'Personal' })[note.category] || note.category; noteMeta.append(categoryBadge);
        if (note.dueDate) { const due = document.createElement('time'); due.dateTime = note.dueDate; due.className = isOverdueNote(note) ? 'note-due overdue-date' : 'note-due'; due.textContent = `${isOverdueNote(note) ? 'Venció' : 'Vence'} ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${note.dueDate}T00:00:00`))}`; noteMeta.append(due); }

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
    .filter((item) => item.period === planPeriodFilter.value && item.status !== 'completado' && (item.priority === 'alta' || isOverdue(item)))
    .sort((first, second) => {
      const firstScore = (first.priority === 'alta' ? 2 : 0) + (isOverdue(first) ? 1 : 0);
      const secondScore = (second.priority === 'alta' ? 2 : 0) + (isOverdue(second) ? 1 : 0);
      if (secondScore !== firstScore) return secondScore - firstScore;
      return new Date(first.dueDate) - new Date(second.dueDate);
    })
    .slice(0, 4);
}

function renderDashboardNotes() {
  if (!dashboardNotesList || !dashboardEmptyNotes) return;
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
  const alertItems = [];
  const withoutSchedule = teachers.filter((teacher) => teacher.active !== false && !teacher.schedule.length);
  if (withoutSchedule.length) alertItems.push({ label: 'Docentes sin carga lectiva', value: `${withoutSchedule.length} docente(s) activo(s)`, view: 'teachers', level: 'warning' });
  const overdue = planItems.filter((item) => item.period === planPeriodFilter.value && isOverdue(item));
  if (overdue.length) alertItems.push({ label: 'Actividades vencidas del plan', value: `${overdue.length} pendiente(s)`, view: 'plan', level: 'danger' });
  const urgentNotes = notes.filter((note) => note.urgent && !note.completed);
  if (urgentNotes.length) alertItems.push({ label: 'Notas urgentes', value: `${urgentNotes.length} requieren revisión`, view: 'notes', level: 'danger' });
  const periodActivities = communityActivities.filter((activity) => activity.period === communityPeriod.value);
  const incomplete = periodActivities.filter((activity) => ['ejecutada', 'evidenciada'].includes(activity.status) && !hasCompleteEvidence(activity));
  if (incomplete.length) alertItems.push({ label: 'Expedientes incompletos', value: `${incomplete.length} actividad(es)`, view: 'communities', level: 'warning' });
  const followUp = communityMembers.filter((member) => member.period === communityPeriod.value && ['inscrito', 'activo'].includes(member.status) && studentParticipationStats(member).situation === 'En seguimiento');
  if (followUp.length) alertItems.push({ label: 'Estudiantes en seguimiento', value: `${followUp.length} con baja participación`, view: 'communities', level: 'info' });
  dashboardAlertsList.replaceChildren();
  document.getElementById('dashboard-alerts-empty').hidden = alertItems.length > 0;
  alertItems.forEach((entry) => {
    const item = document.createElement('li');
    item.className = `executive-item executive-item-${entry.level}`;
    const label = document.createElement('strong');
    label.textContent = entry.label;
    const value = document.createElement('span');
    value.textContent = entry.value;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'text-button'; button.textContent = 'Revisar'; button.addEventListener('click', () => showView(entry.view));
    const content = document.createElement('div'); content.append(label, value); item.append(content, button);
    dashboardAlertsList.append(item);
  });
}

function renderDailySummary() {
  const periodActivities = communityActivities.filter((activity) => activity.period === communityPeriod.value);
  const upcoming = periodActivities.filter((activity) => activity.date >= getToday() && !['ejecutada', 'evidenciada'].includes(activity.status));
  document.getElementById('dashboard-total').textContent = teachers.filter((teacher) => teacher.active !== false).length;
  document.getElementById('dashboard-pending').textContent = teachers.filter((teacher) => teacher.active !== false && teacher.schedule.length).length;
  document.getElementById('dashboard-overdue').textContent = communityMembers.filter((member) => member.period === communityPeriod.value && ['inscrito', 'activo'].includes(member.status)).length;
  document.getElementById('dashboard-completion').textContent = upcoming.length;
  document.getElementById('dashboard-urgent-notes').textContent = notes.filter((note) => note.urgent && !note.completed).length;
  document.getElementById('dashboard-incomplete-evidence').textContent = periodActivities.filter((activity) => ['ejecutada', 'evidenciada'].includes(activity.status) && !hasCompleteEvidence(activity)).length;
}

function renderDashboardAgenda() {
  const list = document.getElementById('dashboard-agenda-list'); if (!list) return;
  const end = new Date(`${getToday()}T00:00:00`); end.setDate(end.getDate() + 7); const endKey = formatDateKey(end);
  const entries = [
    ...planItems.filter((item) => item.period === planPeriodFilter.value && item.status !== 'completado' && item.dueDate >= getToday() && item.dueDate <= endKey).map((item) => ({ date: item.dueDate, title: item.task, meta: `Plan · ${item.responsible}`, view: 'plan' })),
    ...communityActivities.filter((activity) => activity.period === communityPeriod.value && activity.date >= getToday() && activity.date <= endKey && !['ejecutada', 'evidenciada'].includes(activity.status)).map((activity) => ({ date: activity.date, title: activity.name, meta: `${communityName(activity.community)} · ${activity.start}`, view: 'communities' }))
  ].sort((a, b) => a.date.localeCompare(b.date));
  list.replaceChildren(); document.getElementById('dashboard-agenda-empty').hidden = entries.length > 0;
  entries.slice(0, 8).forEach((entry) => { const item = document.createElement('li'); item.className = 'executive-item'; const date = document.createElement('time'); date.dateTime = entry.date; date.textContent = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' }).format(new Date(`${entry.date}T00:00:00`)); const content = document.createElement('div'); const title = document.createElement('strong'); title.textContent = entry.title; const meta = document.createElement('span'); meta.textContent = entry.meta; content.append(title, meta); const button = document.createElement('button'); button.type = 'button'; button.className = 'text-button'; button.textContent = 'Abrir'; button.addEventListener('click', () => showView(entry.view)); item.append(date, content, button); list.append(item); });
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
  if (viewName === 'communities') renderCommunities();
  if (viewName === 'backup') renderBackupSummary();
  if (viewName === 'dashboard') {
    renderDailySummary();
    renderDashboardAlerts();
    renderDashboardAgenda();
  }
}

function toggleNote(id) {
  notes = notes.map((note) => note.id === id ? { ...note, completed: !note.completed } : note);
  saveNotes();
  renderNotes();
}

function resetNoteForm() {
  noteForm.reset();
  noteCategory.value = 'academico';
  editingNoteId.value = '';
  saveNoteButton.textContent = 'Guardar nota';
  cancelNoteEdit.hidden = true;
}

function setNoteFormPanel(open) {
  noteFormPanel.hidden = !open;
  toggleNoteFormButton.setAttribute('aria-expanded', String(open));
  toggleNoteFormButton.textContent = open ? '× Cerrar formulario' : '＋ Nueva nota';
  if (open) window.setTimeout(() => noteText.focus(), 0);
}

function startEditNote(note) {
  setNoteFormPanel(true);
  editingNoteId.value = note.id;
  noteText.value = note.text;
  noteUrgent.checked = note.urgent === true;
  noteCategory.value = note.category || 'academico';
  noteDueDate.value = note.dueDate || '';
  saveNoteButton.textContent = 'Guardar cambios';
  cancelNoteEdit.hidden = false;
  noteStatus.textContent = 'Editando la nota seleccionada.';
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
  const employeeId = teacherId.value.trim();
  const firstNames = teacherFirstNames.value.trim();
  const lastNames = teacherLastNames.value.trim();
  const phone = teacherPhone.value.trim();
  const email = teacherEmail.value.trim();
  const condition = teacherCondition.value;
  const specialty = teacherSpecialty.value.trim();
  const certifications = teacherCertifications.value.trim();
  const status = teacherStatus.value;
  const originalCode = editingTeacherCode.value;

  if (!code || !firstNames || !lastNames) return;
  if (!originalCode && teachers.some((teacher) => teacher.code.toLowerCase() === code.toLowerCase())) {
    setFormStatus('Ya existe un docente con ese código.');
    teacherCode.focus();
    return;
  }
  if (employeeId && teachers.some((teacher) => teacher.employeeId === employeeId && teacher.code !== originalCode)) {
    setFormStatus('Ya existe un docente con ese ID.');
    teacherId.focus();
    return;
  }

  if (originalCode) {
    teachers = teachers.map((teacher) => teacher.code === originalCode ? { ...teacher, employeeId, code, firstNames, lastNames, email, phone, condition, specialty, certifications, active: status === 'activo' } : teacher);
    setFormStatus('Datos del docente actualizados correctamente.');
  } else {
    teachers.push(normalizeTeacherStatus({ employeeId, code, firstNames, lastNames, email, phone, condition, specialty, certifications, active: status === 'activo' }));
    setFormStatus('Docente agregado correctamente.');
  }

  saveTeachers();
  renderTeachers();
  resetTeacherForm();
  setTeacherManagementPanel(false);
});

cancelEdit.addEventListener('click', () => {
  resetTeacherForm();
  setFormStatus('Edición cancelada.');
  setTeacherManagementPanel(false);
});

toggleNoteFormButton.addEventListener('click', () => {
  const willOpen = noteFormPanel.hidden;
  if (!willOpen) resetNoteForm();
  setNoteFormPanel(willOpen);
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = noteText.value.trim();
  const urgent = noteUrgent.checked;
  const category = noteCategory.value;
  const dueDate = noteDueDate.value;
  const noteId = editingNoteId.value;
  if (!text) return;

  if (noteId) {
    notes = notes.map((note) => note.id === noteId ? { ...note, text, urgent, category, dueDate, updatedAt: new Date().toISOString() } : note);
    noteStatus.textContent = 'Nota actualizada correctamente.';
  } else {
    notes.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, urgent, category, dueDate, completed: false, createdAt: new Date().toISOString() });
    noteStatus.textContent = urgent ? 'Nota urgente guardada correctamente.' : 'Nota guardada correctamente.';
  }
  saveNotes();
  resetNoteForm();
  renderNotes();
  setNoteFormPanel(false);
});
noteSearch.addEventListener('input', renderNotes);
noteCategoryFilter.addEventListener('change', renderNotes);
noteStatusFilter.addEventListener('change', renderNotes);

cancelNoteEdit.addEventListener('click', () => {
  resetNoteForm();
  noteStatus.textContent = 'Edición cancelada.';
  setNoteFormPanel(false);
});

planForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const axis = planAxis.value;
  const task = planTask.value.trim();
  const responsible = planResponsible.value.trim();
  const dueDate = planDueDate.value;
  const priority = planPriority.value;
  const status = planStatus.value;
  const period = planPeriod.value;
  const goal = planGoal.value.trim();
  const indicator = planIndicator.value.trim();
  const result = planResult.value.trim();
  const progress = Number(planProgressValue.value) || 0;
  const evidence = planEvidence.value.trim();
  const observations = planObservations.value.trim();
  const itemId = editingPlanId.value;
  if (!axis || !task || !responsible || !dueDate) return;
  if (status === 'completado' && !evidence) { planStatusMessage.textContent = 'Para completar la actividad debes registrar el enlace de evidencia.'; planEvidence.focus(); return; }

  const previous = planItems.find((item) => item.id === itemId);
  const planItem = { id: itemId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, period, axis, task, responsible, dueDate, priority, status, goal, indicator, result, progress: status === 'completado' ? 100 : progress, evidence, observations, createdAt: previous?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
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
planPeriodFilter.addEventListener('change', () => { planPeriod.value = planPeriodFilter.value; renderPlan(); });
planStatus.addEventListener('change', () => { if (planStatus.value === 'completado') planProgressValue.value = '100'; });

exportBackupButton.addEventListener('click', exportBackup);
backupFileInput.addEventListener('change', () => {
  selectedBackupFile = backupFileInput.files[0] || null;
  backupFileName.textContent = selectedBackupFile ? selectedBackupFile.name : 'Ningún archivo seleccionado';
  importBackupButton.disabled = !selectedBackupFile;
  backupFileDetails.hidden = !selectedBackupFile;
  if (selectedBackupFile) {
    const size = selectedBackupFile.size < 1024 ? `${selectedBackupFile.size} B` : `${(selectedBackupFile.size / 1024).toFixed(1)} KB`;
    backupFileSize.textContent = `Tamaño: ${size}`;
    backupFileDate.textContent = `Modificado: ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(selectedBackupFile.lastModified))}`;
  }
  backupStatus.textContent = '';
});
importBackupButton.addEventListener('click', importBackup);

document.getElementById('manage-community-members').addEventListener('click', () => {
  const panel = document.getElementById('community-members-panel'); panel.hidden = false; renderCommunityMembers(); panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('close-community-members').addEventListener('click', () => { document.getElementById('community-members-panel').hidden = true; });
document.getElementById('download-members-template').addEventListener('click', downloadCommunityMembersTemplate);
document.getElementById('community-members-file').addEventListener('change', (event) => {
  selectedCommunityMembersFile = event.target.files[0] || null;
  document.getElementById('community-members-file-name').textContent = selectedCommunityMembersFile ? selectedCommunityMembersFile.name : 'Ningún archivo seleccionado';
  document.getElementById('import-community-members').disabled = !selectedCommunityMembersFile;
  document.getElementById('community-member-message').textContent = '';
});
document.getElementById('import-community-members').addEventListener('click', importCommunityMembersExcel);
document.getElementById('cancel-community-member').addEventListener('click', resetCommunityMemberForm);
document.getElementById('community-member-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = document.getElementById('editing-community-member-id').value;
  const code = document.getElementById('member-code').value.trim();
  if (communityMembers.some((member) => member.period === communityPeriod.value && member.code.toLocaleLowerCase('es-PE') === code.toLocaleLowerCase('es-PE') && member.id !== id)) {
    document.getElementById('community-member-message').textContent = `Ya existe un estudiante con ese código en ${communityPeriod.value}.`; return;
  }
  const previous = communityMembers.find((member) => member.id === id);
  const member = { ...(previous || {}), id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, period: previous?.period || communityPeriod.value, community: document.getElementById('member-community').value, code, name: document.getElementById('member-name').value.trim(), email: document.getElementById('member-email').value.trim(), phone: document.getElementById('member-phone').value.trim(), cycle: document.getElementById('member-cycle').value.trim(), role: document.getElementById('member-role').value, status: document.getElementById('member-status').value, createdAt: previous?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (id) communityMembers = communityMembers.map((item) => item.id === id ? member : item); else communityMembers.push(member);
  saveCommunityMembers(); resetCommunityMemberForm(); renderCommunityMembers(); renderCommunities(); renderBackupSummary();
  document.getElementById('community-member-message').textContent = id ? 'Estudiante actualizado correctamente.' : 'Estudiante agregado correctamente.';
});

document.getElementById('close-attendance').addEventListener('click', closeAttendance);
document.getElementById('close-attendance-footer').addEventListener('click', closeAttendance);
document.getElementById('close-student-profile').addEventListener('click', closeStudentProfile);
document.getElementById('close-student-profile-footer').addEventListener('click', closeStudentProfile);
document.getElementById('student-profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = document.getElementById('student-profile-id').value;
  const member = communityMembers.find((item) => item.id === id);
  if (!member) return;
  member.portfolio = document.getElementById('student-profile-portfolio').value.trim();
  member.projects = document.getElementById('student-profile-projects').value.trim();
  member.certifications = document.getElementById('student-profile-certifications').value.trim();
  member.mentorObservations = document.getElementById('student-profile-observations').value.trim();
  member.updatedAt = new Date().toISOString();
  saveCommunityMembers(); renderCommunityMembers();
  document.getElementById('student-profile-message').textContent = 'Seguimiento guardado correctamente.';
});
document.getElementById('save-attendance').addEventListener('click', () => {
  const activity = communityActivities.find((item) => item.id === attendanceActivityId); if (!activity) return;
  activity.attendance = [...document.querySelectorAll('#attendance-list input:checked')].map((input) => input.value);
  activity.participants = activity.attendance.length;
  activity.evidenceChecklist = { ...evidenceChecklist(activity), attendance: true };
  activity.updatedAt = new Date().toISOString(); saveCommunityActivities(); closeAttendance(); renderCommunities();
  renderBackupSummary();
  communityActivityMessage.textContent = `Asistencia guardada: ${activity.participants} participante(s).`;
});

document.getElementById('new-community-activity').addEventListener('click', () => {
  resetCommunityActivityForm();
  communityFormPanel.hidden = false;
  communityActivityDate.min = getToday();
  communityActivityName.focus();
});

document.getElementById('cancel-community-activity').addEventListener('click', () => {
  resetCommunityActivityForm();
  communityActivityMessage.textContent = 'Registro cancelado.';
});

activityCommunity.addEventListener('change', () => {
  const mentor = communityDefinitions.find((community) => community.id === activityCommunity.value)?.mentor;
  if (mentor && !communityActivityResponsible.value.trim()) communityActivityResponsible.value = mentor;
});

communityActivityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (communityActivityEnd.value <= communityActivityStart.value) {
    communityActivityMessage.textContent = 'La hora de término debe ser posterior a la hora de inicio.';
    communityActivityEnd.focus();
    return;
  }
  const checklistValues = Object.fromEntries(evidenceInputs.map((input) => [input.id.replace('evidence-', ''), input.checked]));
  if (communityActivityStatus.value === 'evidenciada' && (!communityActivityEvidence.value.trim() || !Object.values(checklistValues).every(Boolean))) {
    communityActivityMessage.textContent = 'Para cerrar el expediente registra el enlace y completa los cinco requisitos.';
    communityActivityEvidence.focus();
    return;
  }
  const activityId = editingCommunityActivityId.value;
  const activity = {
    id: activityId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    period: activityId ? communityActivities.find((item) => item.id === activityId)?.period || communityPeriod.value : communityPeriod.value,
    community: activityCommunity.value,
    name: communityActivityName.value.trim(),
    type: communityActivityType.value,
    responsible: communityActivityResponsible.value.trim(),
    date: communityActivityDate.value,
    start: communityActivityStart.value,
    end: communityActivityEnd.value,
    environment: communityActivityEnvironment.value.trim(),
    participants: Number(communityActivityParticipants.value) || 0,
    status: communityActivityStatus.value,
    evidence: communityActivityEvidence.value.trim(),
    objective: communityActivityObjective.value.trim(),
    evidenceChecklist: checklistValues,
    attendance: activityId ? communityActivities.find((item) => item.id === activityId)?.attendance || [] : [],
    createdAt: activityId ? communityActivities.find((item) => item.id === activityId)?.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (activityId) {
    communityActivities = communityActivities.map((item) => item.id === activityId ? activity : item);
    communityActivityMessage.textContent = 'Actividad actualizada correctamente.';
  } else {
    communityActivities.push(activity);
    communityActivityMessage.textContent = 'Actividad registrada correctamente.';
  }
  saveCommunityActivities();
  resetCommunityActivityForm();
  renderCommunities();
  renderBackupSummary();
});

communityFilter.addEventListener('change', renderCommunities);
communityStatusFilter.addEventListener('change', renderCommunities);
communityPeriod.addEventListener('change', () => {
  localStorage.setItem(communityPeriodStorageKey, communityPeriod.value);
  resetCommunityActivityForm(); resetCommunityMemberForm(); renderCommunities(); renderCommunityMembers();
  communityActivityMessage.textContent = `Mostrando información del periodo ${communityPeriod.value}.`;
});

dashboardSearchInput?.addEventListener('input', () => {
  renderDashboardAlerts();
});
dashboardPriorityFilter?.addEventListener('change', () => {
  renderDashboardAlerts();
});

calendarPrevButton?.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderDashboardCalendar();
});

calendarNextButton?.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderDashboardCalendar();
});

viewTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => showView(trigger.dataset.view));
});
toggleTeacherFormButton.addEventListener('click', () => {
  const willOpen = teacherManagementPanel.hidden;
  if (!willOpen) resetTeacherForm();
  setTeacherManagementPanel(willOpen);
});
teacherFilter.addEventListener('input', renderTeachers);
teacherFilter.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') event.preventDefault();
});
renderNotes();
renderPlan();
renderDailySummary();
renderDashboardAlerts();
renderDashboardAgenda();
updateDateTime();
window.setInterval(updateDateTime, 1000);
setAuthenticated(hasActiveSession());
