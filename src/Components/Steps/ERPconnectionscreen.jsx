
import React, { useState } from 'react';
import { CreditCard, Key } from 'lucide-react';
import { CardContainer } from './CardContainer';
import { InputField } from '../../Components/ui/InputField';
import { Button } from '../../Components/ui/Button';
import { Footer } from './Footer';


export const ERPConnectionScreen = ({ onNext }) => {
  const [erpId, setErpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <CardContainer title="Connect your ERP to automatically sync faculty, timetable,  and classroom data — no manual setup required">
      <div className="max-w-2xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <InputField
            label="ENTER ERP ID"
            value={erpId}
            onChange={(e) => setErpId(e.target.value)}
            placeholder="e.g. A6BZU55"
            icon={CreditCard}
          />

          <InputField
            label="ENTER PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            icon={Key}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="flex justify-center">
          <Button onClick={onNext} className=" mr-40 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium py-3 px-8 rounded-md shadow-md transition-all duration-200">
            Connect ERP
          </Button>
        </div>
      </div>

      <Footer />
    </CardContainer>
  );
};



