import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function AdminRequestsPage() {
  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['/api/admin/prayer-requests'],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prayer Requests</h1>
        <p className="text-gray-600">Review and manage prayer requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prayer Requests</CardTitle>
          <CardDescription>Review and manage prayer requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prayerRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No prayer requests submitted yet.</p>
            ) : (
              prayerRequests.map((request: any) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full ml-4">
                      {request.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</span>
                    <span>{request.is_public ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}