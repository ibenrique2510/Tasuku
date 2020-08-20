export const API_URL = 'http://10.1.33.180:8080/';

// user APIs
export const LOGIN                            = API_URL + 'users/login';
export const ADD_USER                         = API_URL + 'users/addUser/';
export const GET_USER                         = API_URL + 'users/getUser/';
export const GET_USERS                        = API_URL + 'users/getUsers';
export const GET_MANAGERS                     = API_URL + 'users/getManagers';
export const GET_ADMINS                       = API_URL + 'users/getAdmins';
export const GET_ALL_USERS                    = API_URL + 'users/getAllUsers';
export const GET_ALL_USERS_BUT_SELF           = API_URL + 'users/getAllUsersButSelf/';
export const UPDATE_USER                      = API_URL + 'users/updateUser/';
export const DELETE_USER                      = API_URL + 'users/deleteUser/'
export const GET_USERS_BY_GROUP_ID_ADMIN      = API_URL + 'users/getUsersByGroupIdAdmin/';
export const GET_USERS_BY_GROUP_ID_MANAGER    = API_URL + 'users/getUsersByGroupIdManager/';
export const GET_USERS_BY_GROUP_ID_AS_MANAGER = API_URL + 'users/getUsersByGroupIdAsManager/';
export const GET_NO_GROUP_USERS               = API_URL + 'users/getNoGroupUsers';
export const GET_NO_GROUP_MANAGERS            = API_URL + 'users/getNoGroupManagers';
export const GET_ASSIGNEES                    = API_URL + 'users/getAssignees';

// group APIs
export const GET_GROUP    = API_URL + 'groups/getGroup/';
export const ADD_GROUP    = API_URL + 'groups/addGroup/';
export const GET_GROUPS   = API_URL + 'groups/getGroups';
export const UPDATE_GROUP = API_URL + 'groups/updateGroup/';

// task APIs
export const GET_TASK                  = API_URL + 'tasks/getTask/';
export const GET_TASKS                 = API_URL + 'tasks/getTasks/';
export const GET_OLD_TASKS             = API_URL + 'tasks/getOldTasks/';
export const ADD_TASK                  = API_URL + 'tasks/addTask/';
export const UPDATE_TASK_ACCEPT_STATUS = API_URL + 'tasks/updateTaskAcceptStatus/';
export const COMMIT_TASK               = API_URL + 'tasks/commitTask/';
export const EVALUATE_TASK             = API_URL + 'tasks/evaluateTask/';
export const UPDATE_TASK               = API_URL + 'tasks/updateTask/';
export const DELETE_TASK               = API_URL + 'tasks/deleteTask/';
export const ACCEPT_OR_DECLINE_TASK    = API_URL + 'tasks/updateTaskAcceptStatus/';

export const GET_NOTI_BY_USER = API_URL + 'users/getNotifications/'
export const READ_NOTI        = API_URL + 'users/readNotification/';

export const LOGOUT_API = API_URL + '/logout';

// role values
export const USER    = 'User';
export const MANAGER = 'Manager';
export const ADMIN   = 'Admin';

// status values
export const WAITING_FOR_ACCEPT      = "0";
export const ACCEPTED                = "1";
export const DECLINED                = "2";
export const NOT_STARTED_YET         = "3";
export const ON_GOING                = "4";
export const OVERDUE                 = "5";
export const COMMITED                = "6";
export const FINISHED_CONFIRMED      = "7";
export const CANNOT_FINISH_CONFIRMED = "8";

//response values
export const NO_ERROR                         = "No Error";
export const SERVER_ERROR                     = "Server error";
export const FOUND_NO_USER                    = "Found no user";
export const FOUND_NO_MANAGER                 = "Found no manager";
export const FOUND_NO_ADMIN                   = "Found no admin";
export const FOUND_NO_TASK                    = "Found no task";
export const FOUND_NO_USER_TO_OPERATE_ACTION  = "Found no user to operate action";
export const WRONG_EMAIL_PASSWORD             = "Wrong email or password";
export const NO_VALUE_PRESENT                 = "No value present";
export const EMAIL_ALREADY_EXISTED            = "Email is already existed";
export const FOUND_NO_GROUP                   = "Found no group";
export const FOUND_NO_GROUP_TO_OPERATE_ACTION = "Found no group to operate action";
export const CANNOT_UPDATE_TASK_NOW           = "Cannot update task right now";