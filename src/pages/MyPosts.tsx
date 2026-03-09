import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { ItemCard } from "../components/ItemCard";
import { Search, PackageOpen, PlusCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const MyPosts: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Remove orderBy to avoid requiring a composite index in Firestore
    const q = query(
      collection(db, "items"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const itemsData: any[] = [];
        querySnapshot.forEach((doc) => {
          itemsData.push({ id: doc.id, ...doc.data() });
        });

        // Sort items by createdAt descending in memory
        itemsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setItems(itemsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching my posts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredItems = items.filter(
    (item) =>
      item.type === activeTab &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Posts</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage the items you have reported as lost or found.
          </p>
        </div>
        <div className="relative w-full md:max-w-md mt-2 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4 sm:gap-8 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab("lost")}
            className={`${activeTab === "lost"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`${activeTab === "found"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Found Items
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No posts found</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto mb-6">
            {searchQuery
              ? "No posts match your search criteria."
              : "You haven't posted any items yet."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate("/post")}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Post Item
            </button>
          )}
        </div>
      )}
    </div>
  );
};
