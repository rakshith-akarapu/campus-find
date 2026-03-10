/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./pages/Dashboard";
import { PostItem } from "./pages/PostItem";
import { ItemDetails } from "./pages/ItemDetails";
import { MyPosts } from "./pages/MyPosts";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { isFirebaseConfigured } from "./services/firebase";
import { FirebaseNotConfigured } from "./components/FirebaseNotConfigured";
import { Footer } from "./components/Footer";

export default function App() {
  if (!isFirebaseConfigured) {
    return <FirebaseNotConfigured />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <PostItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-posts"
                element={
                  <ProtectedRoute>
                    <MyPosts />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
