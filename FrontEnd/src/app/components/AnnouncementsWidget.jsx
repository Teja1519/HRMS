import { useState, useEffect } from "react";
import { Megaphone, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import api from "../lib/api";

export function AnnouncementsWidget({ onNavigate, limit = 3 }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      const list = response.data?.data ?? [];
      setAnnouncements(list.slice(0, limit));
    } catch (error) {
      console.error("Failed to load announcements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAnnouncements();
  }, [limit]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="w-5 h-5 text-primary" />
            Latest Announcements
          </CardTitle>
          <CardDescription>Official news and company updates</CardDescription>
        </div>
        {onNavigate && (
          <Button variant="ghost" size="sm" onClick={() => onNavigate("/announcements")}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading updates...</div>
        ) : announcements.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
            No company announcements posted yet.
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.NotificationId} className="p-3.5 rounded-lg bg-accent/40 border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{item.Title}</span>
                <Badge variant="outline" className="text-[10px]">{item.Priority || "Normal"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.Message}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
