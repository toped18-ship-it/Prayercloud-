
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-rose-600" />
      </div>
      <h1 className="text-3xl font-black text-blue-900 mb-2">Access Restricted</h1>
      <p className="text-slate-500 mb-8 max-w-md text-center">
        Your current account role does not have permission to access this mission resource. 
        Please contact your regional coordinator if you believe this is an error.
      </p>
      <Link to="/home">
        <Button className="rounded-2xl h-12 px-8 bg-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
