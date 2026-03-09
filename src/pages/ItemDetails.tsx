import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getItemById, updateItemStatus, deleteItem } from "../services/itemService";
import { MapPin, Calendar, User, ArrowLeft, CheckCircle, Trash2, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch (err: any) {
        setError(err.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleStatusChange = async () => {
    if (!id || !item) return;
    setActionLoading(true);
    try {
      const newStatus = item.status === "open" ? "returned" : "open";
      await updateItemStatus(id, newStatus);
      setItem({ ...item, status: newStatus });
    } catch (err: any) {
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setActionLoading(true);
    try {
      await deleteItem(id);
      navigate("/");
    } catch (err: any) {
      alert("Failed to delete item");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Item not found</h2>
        <p className="mt-2 text-gray-500">{error || "This item may have been deleted."}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = user?.uid === item.userId;
  const isReturned = item.status === "returned";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
      </button>

      <div className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-50 relative min-h-[300px] md:min-h-[500px]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover ${isReturned ? 'grayscale opacity-70' : ''}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-lg font-medium">No Image Available</span>
              </div>
            )}
            
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <span
                className={`inline-flex items-center px-4 py-1.5 text-sm font-bold tracking-wide rounded-full shadow-md backdrop-blur-sm ${
                  item.type === "lost"
                    ? "bg-red-500/90 text-white"
                    : "bg-emerald-500/90 text-white"
                }`}
              >
                {item.type.toUpperCase()}
              </span>
            </div>
            
            {isReturned && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-6 py-3 text-lg font-bold tracking-wider rounded-full shadow-xl bg-gray-900 text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" /> RETURNED
                </span>
              </div>
            )}
          </div>
          
          <div className="p-8 md:p-10 md:w-1/2 flex flex-col">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                {item.title}
              </h1>
              
              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <MapPin className="h-6 w-6 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Location</p>
                    <p className="text-base">{item.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Calendar className="h-6 w-6 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Posted</p>
                    <p className="text-base">
                      {item.createdAt?.toDate
                        ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
                        : "Just now"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <User className="h-6 w-6 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Posted by</p>
                    <p className="text-base">
                      {user ? item.userEmail : "Login to see contact info"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 text-base whitespace-pre-wrap leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStatusChange}
                  disabled={actionLoading}
                  className={`flex-1 flex justify-center items-center gap-2 py-3.5 px-6 border rounded-xl shadow-sm text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-all ${
                    isReturned
                      ? "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
                      : "border-transparent text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  {isReturned ? "Mark as Open" : "Mark as Returned"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex justify-center items-center gap-2 py-3.5 px-6 border border-red-200 rounded-xl shadow-sm text-sm font-bold text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </button>
              </div>
            )}
            
            {!isOwner && user && !isReturned && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <a
                  href={`mailto:${item.userEmail}?subject=Regarding your ${item.type} item: ${item.title}`}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <Mail className="h-5 w-5" />
                  Contact Poster
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
