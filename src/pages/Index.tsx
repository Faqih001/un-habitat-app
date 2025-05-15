
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="py-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">UN-Habitat Project Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage and visualize UN-Habitat projects across countries, organizational units, and themes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-un-blue text-white">
              <CardTitle className="text-2xl">Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-gray-600">
                View visual analytics of all projects by country, themes, and organizational units.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-un-blue text-white">
              <CardTitle className="text-2xl">Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-gray-600">
                View, add, edit, or delete projects and manage all project details.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/projects')}
              >
                Manage Projects
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-12 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Available API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">All Projects</h3>
                <code className="block p-2 bg-gray-100 rounded mt-1">
                  /api/projects/all
                </code>
              </div>
              <div>
                <h3 className="font-medium">Projects by Country</h3>
                <code className="block p-2 bg-gray-100 rounded mt-1">
                  /api/projects/country/kenya
                </code>
              </div>
              <div>
                <h3 className="font-medium">Projects by Approval Status</h3>
                <code className="block p-2 bg-gray-100 rounded mt-1">
                  /api/projects/status/Approved
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
