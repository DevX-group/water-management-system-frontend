import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { SignupFormData, SignupFormErrors } from '@/types/auth';

interface SignupFormProps {
  formData:      SignupFormData;
  formErrors:    SignupFormErrors;
  showPassword:         boolean;
  showConfirmPassword:  boolean;
  onTogglePassword:     () => void;
  onToggleConfirm:      () => void;
  onChangeField: (field: keyof SignupFormData, value: string) => void;
  onSubmit:      (e: React.FormEvent) => void;
}

const ErrorMsg: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
      className="text-sm text-destructive flex items-center gap-1">
      ⚠️ {msg}
    </motion.p>
  ) : null;

export const SignupForm: React.FC<SignupFormProps> = ({
  formData, formErrors, showPassword, showConfirmPassword,
  onTogglePassword, onToggleConfirm, onChangeField, onSubmit,
}) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
    onSubmit={onSubmit} className="space-y-5"
  >
    {/* Account Holder */}
    <div className="space-y-2">
      <Label htmlFor="accountHolder">Account Holder Name</Label>
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
        <Input id="accountHolder" placeholder="Enter account holder name" value={formData.accountHolder}
          onChange={(e) => onChangeField('accountHolder', e.target.value)}
          className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" style={{ caretColor: 'black' }} />
      </div>
    </div>

    {/* Email */}
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
        <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
          onChange={(e) => onChangeField('email', e.target.value)}
          className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" style={{ caretColor: 'black' }} />
      </div>
      <ErrorMsg msg={formErrors.email} />
    </div>

    {/* NIC */}
    <div className="space-y-2">
      <Label htmlFor="nic">NIC Number</Label>
      <div className="relative">
        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
        <Input id="nic" placeholder="Enter your NIC (e.g., 123456789V)" value={formData.nic}
          onChange={(e) => onChangeField('nic', e.target.value)}
          className="h-12 pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" style={{ caretColor: 'black' }} />
      </div>
      <ErrorMsg msg={formErrors.nic} />
    </div>

    {/* Password */}
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password}
          onChange={(e) => onChangeField('password', e.target.value)}
          className="h-12 pl-12 pr-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" style={{ caretColor: 'black' }} />
        <button type="button" onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <ErrorMsg msg={formErrors.password} />
    </div>

    {/* Confirm Password */}
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
        <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword}
          onChange={(e) => onChangeField('confirmPassword', e.target.value)}
          className="h-12 pl-12 pr-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" style={{ caretColor: 'black' }} />
        <button type="button" onClick={onToggleConfirm}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <ErrorMsg msg={formErrors.confirmPassword} />
    </div>

    <Button type="submit" className="w-full h-12 gradient-primary shadow-soft hover:opacity-90 transition-opacity">
      Register
    </Button>

    <p className="text-center text-muted-foreground">
      Already have an account?{' '}
      <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
    </p>
  </motion.form>
);
