import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Trash2, Eye, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { deleteItem, updateItemStatus } from "../services/itemService";

interface ItemCardProps {
  item: any;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isReturned = item.status === "returned";
  const isOwner = user?.uid === item.userId;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await deleteItem(item.id);
    } catch (err) {
      alert("Failed to delete item");
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsUpdating(true);
    try {
      const newStatus = isReturned ? "open" : "returned";
      await updateItemStatus(item.id, newStatus);
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div onClick={handleCardClick} className="group flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transform hover:scale-[1.02] transition duration-300 cursor-pointer h-full relative animate-fade-in">
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isReturned ? 'grayscale opacity-60' : ''}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 group-hover:scale-105 transition-transform duration-300">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm ${item.type === "lost"
                ? "bg-red-500/90 text-white"
                : "bg-emerald-500/90 text-white"
              }`}
          >
            {item.type.toUpperCase()}
          </span>
        </div>
        {isReturned && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 text-sm font-bold tracking-wider rounded-full shadow-md bg-gray-900 text-white flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              RETURNED
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>

        <div className="mt-4 flex flex-col gap-2.5 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate font-medium">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-medium">
              {item.createdAt?.toDate
                ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
                : "Just now"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <button
            onClick={handleCardClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          {isOwner && (
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
              <button
                onClick={handleStatusChange}
                disabled={isUpdating}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium active:scale-95 transition-all duration-200 disabled:opacity-50 w-full sm:w-auto ${isReturned
                    ? "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
              >
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{isReturned ? "Open" : "Returned"}</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all duration-200 disabled:opacity-50 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
