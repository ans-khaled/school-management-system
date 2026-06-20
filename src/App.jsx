import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./contexts/AuthContext";

import AppLayout from "./ui/AppLayout";
import SpinnerFullPage from "./ui/SpinnerFullPage";

import ProtectedRoute from "./pages/ProtectedRoute";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));

// Admin Role pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Students = lazy(() => import("./pages/admin/Students"));
const Teachers = lazy(() => import("./pages/admin/Teachers"));
const Parents = lazy(() => import("./pages/admin/Parents"));
const Classes = lazy(() => import("./pages/admin/Classes"));
const Exams = lazy(() => import("./pages/admin/Exams"));
const Subjects = lazy(() => import("./pages/admin/Subjects"));
const Grades = lazy(() => import("./pages/admin/Grades"));
const Attendances = lazy(() => import("./pages/admin/Attendances"));
const Schedules = lazy(() => import("./pages/admin/Schedules"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Settings = lazy(() => import("./pages/admin/Settings"));

// Admin Reports Page
const StudentReports = lazy(
  () => import("./features/admin/reports/StudentReports"),
);
const FinanceReports = lazy(
  () => import("./features/admin/reports/FinanceReports"),
);
const ReportsOverview = lazy(
  () => import("./features/admin/reports/ReportsOverview"),
);

// Admin Role Features
const StudentDetails = lazy(
  () => import("./features/admin/students/StudentDetails"),
);
const TeacherDetails = lazy(
  () => import("./features/admin/teachers/TeacherDetails"),
);
const ClassDetails = lazy(
  () => import("./features/admin/classes/ClassDetails"),
);
const SubjectDetails = lazy(
  () => import("./features/admin/subjects/SubjectDetails"),
);
const ExamDetails = lazy(() => import("./features/admin/exams/ExamDetails"));
const ParentDetails = lazy(
  () => import("./features/admin/parents/ParentDetails"),
);
const PaymentDetails = lazy(
  () => import("./features/admin/payments/PaymentDetails"),
);

// Student Role pages
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentsSubjects = lazy(() => import("./pages/student/StudentsSubjects"));
const StudentExams = lazy(() => import("./pages/student/StudentExams"));
const StudentGrades = lazy(() => import("./pages/student/StudentGrades"));
const StudentTimetable = lazy(() => import("./pages/student/StudentTimetable"));
const StudentAssignments = lazy(
  () => import("./pages/student/StudentAssignments"),
);

// Teacher Role pages
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));
const TeacherClassroomsStudents = lazy(
  () => import("./pages/teacher/TeacherClassroomsStudents"),
);
const TeacherExams = lazy(() => import("./pages/teacher/TeacherExams"));
const TeacherGrades = lazy(() => import("./pages/teacher/TeacherGrades"));
const TeacherAttendance = lazy(
  () => import("./pages/teacher/TeacherAttendance"),
);
const TeacherAssignments = lazy(
  () => import("./pages/teacher/TeacherAssignments"),
);
const TeacherMessages = lazy(() => import("./pages/teacher/TeacherMessages"));
const TeacherResources = lazy(() => import("./pages/teacher/TeacherResources"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Navigate replace to="login" />} />
              <Route path="login" element={<Login />} />

              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="students" element={<Students />} />
                <Route path="students/:id" element={<StudentDetails />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="teachers/:id" element={<TeacherDetails />} />
                <Route path="parents" element={<Parents />} />
                <Route path="parents/:id" element={<ParentDetails />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classes/:id" element={<ClassDetails />} />
                <Route path="exams" element={<Exams />} />
                <Route path="exams/:id" element={<ExamDetails />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="subjects/:id" element={<SubjectDetails />} />
                <Route path="grades" element={<Grades />} />
                <Route path="attendances" element={<Attendances />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="payments" element={<Payments />} />
                <Route path="payments/:id" element={<PaymentDetails />} />
                <Route path="reports" element={<Reports />}>
                  <Route index element={<ReportsOverview />} />
                  <Route path="students" element={<StudentReports />} />
                  <Route path="finance" element={<FinanceReports />} />
                </Route>
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route
                path="student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="subjects" element={<StudentsSubjects />} />
                <Route path="exams" element={<StudentExams />} />
                <Route path="grades" element={<StudentGrades />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="assignments" element={<StudentAssignments />} />
                {/* 
                
                <Route path="teachers" element={<StuTeachers />} />
                <Route path="classroom" element={<StuClassroom />} />
                <Route path="notifications" element={<StuNotifications />} /> */}
              </Route>

              <Route
                path="teacher"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="profile" element={<TeacherProfile />} />
                <Route
                  path="classrooms"
                  element={<TeacherClassroomsStudents />}
                />
                <Route path="exams" element={<TeacherExams />} />
                <Route path="grades" element={<TeacherGrades />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="attendance" element={<TeacherAttendance />} />
                <Route path="messages" element={<TeacherMessages />} />
                <Route path="resources" element={<TeacherResources />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-gery-700)",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
