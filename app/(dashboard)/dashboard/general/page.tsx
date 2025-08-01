'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Loader2, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Edit
} from 'lucide-react';
import { updateAccount } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function ProfileHeader() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Profile Overview
        </CardTitle>
        <CardDescription>
          Your account information and current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <div>
              <h3 className="text-lg font-semibold">
                {user?.name || 'Not set'}
              </h3>
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge 
                variant={user?.role === 'owner' ? 'default' : 'secondary'}
                className={user?.role === 'owner' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
              >
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountForm({
  state,
  nameValue = '',
  emailValue = ''
}: AccountFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            defaultValue={state.name || nameValue}
            required
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This is the name that will be displayed to other team members.
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            defaultValue={emailValue}
            required
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This email will be used for account notifications and team invitations.
        </p>
      </div>
    </div>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
    />
  );
}

function FormSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-72" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileHeader />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Profile
          </CardTitle>
          <CardDescription>
            Update your personal information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={formAction}>
            <Suspense fallback={<FormSkeleton />}>
              <AccountFormWithData state={state} />
            </Suspense>
            
            {state.error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {state.error}
                </p>
              </div>
            )}
            
            {state.success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <p className="text-green-700 dark:text-green-200 text-sm flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {state.success}
                </p>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Save Changes</p>
                <p className="text-xs text-muted-foreground">
                  Make sure your information is accurate and up to date.
                </p>
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
