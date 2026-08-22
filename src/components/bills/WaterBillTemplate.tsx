import React from 'react';
import type { BillResponse } from '@/types/billing';
import type { CustomerProfile } from '@/components/profile/ProfileForm';
import billLogo from '@/assets/bill-logo.png';

interface WaterBillTemplateProps {
  bill: BillResponse;
  profile: CustomerProfile | null;
}

export const WaterBillTemplate: React.FC<WaterBillTemplateProps> = ({ bill, profile }) => {
  const address = (profile as any)?.address || (profile?.region?.regionName ? `${profile.region.regionName}, Sri Lanka` : 'N/A');
  const name = profile?.accountHolderName || 'N/A';
  const accountNo = (profile as any)?.subscriptionNumber || profile?.nic || 'N/A';
  const meterCurrent = 1234 + (bill.usageUnits || 0); // mock current reading
  const meterPrev = 1234; // mock previous reading
  const rate = bill.usageUnits > 0 ? ((bill.totalAmount || 0) / bill.usageUnits).toFixed(2) : '0.00';
  const total = bill.totalAmount || 0;
  const waterCharge = (total * 0.8).toFixed(2);
  const serviceCharge = (total * 0.1).toFixed(2);
  const vat = (total * 0.1).toFixed(2);

  return (
    <div id="water-bill-template" className="w-[850px] bg-[#f8fafc] p-6 font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 flex flex-col gap-6">
      
        <div className="flex justify-between items-center border-b-4 border-blue-600 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              <img src={billLogo} alt="Akmeemana Pradeshiya Sabha Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-extrabold text-blue-900 leading-tight">ගාල්ල ප්‍රාදේශීය සභාව</h1>
              <h2 className="text-lg font-bold text-blue-800 leading-tight tracking-wide">Galle Pradeshiya Sabha</h2>
              <h3 className="text-base font-bold text-blue-900 leading-tight">காலி பிரதேச சபை</h3>
              <p className="text-[10px] font-semibold text-blue-700 mt-0.5 uppercase tracking-wider">ජල සැපයුම් දෙපාර්තමේන්තුව / Water Supply Department / நீர் வழங்கல் திணைக்களம்</p>
            </div>
          </div>
          <div className="bg-blue-100 border border-blue-200 text-blue-950 p-2 rounded-xl text-right flex items-center gap-2 shrink-0 shadow-sm px-4">
            <div className="bg-white p-1.5 rounded-full shadow-sm"><span className="text-2xl" role="img" aria-label="drop">💧</span></div>
            <div className="text-left">
              <div className="text-lg font-bold leading-tight">ජල බිල්පත</div>
              <div className="text-xl font-bold leading-tight">Water Bill</div>
              <div className="text-base font-bold leading-tight">நீர் கட்டணம்</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/50 border-2 border-blue-100 rounded-lg p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-bold w-[120px] pb-2 text-blue-900">නම / Name</td>
                  <td className="pb-2 text-blue-900 font-bold w-4 text-center">:</td>
                  <td className="font-bold pb-2 text-gray-900">{name}</td>
                </tr>
                <tr>
                  <td className="font-bold pb-2 text-blue-900">ලිපිනය / Address</td>
                  <td className="pb-2 text-blue-900 font-bold text-center">:</td>
                  <td className="pb-2 text-gray-900">{address}</td>
                </tr>
                <tr>
                  <td className="font-bold text-blue-900">මීටර අංකය<br/><span className="text-xs">Meter No</span></td>
                  <td className="text-blue-900 font-bold text-center">:</td>
                  <td className="font-bold text-lg text-blue-950 bg-white px-2 py-1 border border-blue-200 rounded inline-block shadow-sm">{accountNo.startsWith('MTR') ? accountNo : `MTR-${accountNo}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50/50 border-2 border-blue-100 rounded-lg p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-bold w-[140px] pb-2 text-blue-900">බිල් අංකය / Bill No</td>
                  <td className="pb-2 text-blue-900 font-bold w-4 text-center">:</td>
                  <td className="font-bold pb-2 text-base text-gray-900">N-{bill.billId}</td>
                </tr>
                <tr>
                  <td className="font-bold pb-2 text-blue-900">දිනය / Bill Date</td>
                  <td className="pb-2 text-blue-900 font-bold text-center">:</td>
                  <td className="font-bold pb-2 text-gray-900">{bill.billDate || bill.billingPeriod}</td>
                </tr>
                <tr>
                  <td className="font-bold text-blue-900">ගෙවිය යුතු දිනය<br/><span className="text-xs">Due Date</span></td>
                  <td className="text-blue-900 font-bold text-center">:</td>
                  <td className="font-bold text-red-600 text-lg">{bill.dueDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-hidden border-2 border-blue-400 rounded-lg shadow-sm">
          <table className="w-full text-center text-sm border-collapse">
            <thead className="bg-blue-100 text-blue-900 font-bold">
              <tr>
                <th className="border-r border-b-2 border-blue-400 p-2" rowSpan={2}>මාසය<br/>Month<br/><span className="font-normal text-xs">மாதம்</span></th>
                <th className="border-r border-b border-blue-400 p-2" colSpan={2}>මීටර කියවීම (m³)<br/>Meter Reading (m³)<br/><span className="font-normal text-xs">மீட்டர் வாசிப்பு</span></th>
                <th className="border-r border-b-2 border-blue-400 p-2" rowSpan={2}>භාවිතා කළ ජල ප්‍රමාණය (m³)<br/>Water Consumed (m³)<br/><span className="font-normal text-xs">நீர் பயன்படுத்திய அளவு</span></th>
                <th className="border-r border-b-2 border-blue-400 p-2" rowSpan={2}>ඒකක මිල (රු.)<br/>Rate (Rs.)<br/><span className="font-normal text-xs">ஒரு மீட்டர் விலை</span></th>
                <th className="border-b-2 border-blue-400 p-2" rowSpan={2}>මුළු මුදල (රු.)<br/>Amount (Rs.)<br/><span className="font-normal text-xs">மொத்தத் தொகை</span></th>
              </tr>
              <tr>
                <th className="border-r border-b-2 border-blue-400 p-1 bg-blue-50/50">Previous</th>
                <th className="border-r border-b-2 border-blue-400 p-1 bg-blue-50/50">Current</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold text-gray-800">
                <td className="border-r border-blue-400 p-3 bg-white">{bill.billingPeriod}</td>
                <td className="border-r border-blue-400 p-3 bg-white">{meterPrev}</td>
                <td className="border-r border-blue-400 p-3 bg-white">{meterCurrent}</td>
                <td className="border-r border-blue-400 p-3 text-lg bg-white">{bill.usageUnits}</td>
                <td className="border-r border-blue-400 p-3 bg-white">රු. {rate}</td>
                <td className="p-3 text-lg bg-white">රු. {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-blue-600 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-blue-100 text-blue-950 font-bold p-2 text-center border-b-2 border-blue-600 text-sm">
              බිල් විස්තරය / Bill Details / கட்டண விவரங்கள்
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-2 text-left border-r border-gray-200 text-gray-600 font-semibold">විස්තරය / Description / விவரம்</th>
                  <th className="p-2 text-right text-gray-600 font-semibold">මුදල (රු.) / Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-100">
                  <td className="p-2 border-r border-gray-200 text-gray-800">ජල ගාස්තුව / Water Charge / நீர் கட்டணம்</td>
                  <td className="p-2 text-right font-bold text-gray-900">{waterCharge}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-2 border-r border-gray-200 text-gray-800">සේවා ගාස්තුව / Service Charge / சேவை கட்டணம்</td>
                  <td className="p-2 text-right font-bold text-gray-900">{serviceCharge}</td>
                </tr>
                <tr className="border-b-2 border-blue-600">
                  <td className="p-2 border-r border-gray-200 text-gray-800">වැට් (VAT) / VAT (18%) / வரி (18%)</td>
                  <td className="p-2 text-right font-bold text-gray-900">{vat}</td>
                </tr>
                <tr className="bg-blue-100 text-blue-950 font-bold text-lg">
                  <td className="p-3 border-r border-blue-200">මුළු ගාස්තුව / Total Amount / மொத்தத் தொகை</td>
                  <td className="p-3 text-right">රු. {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-between">
            <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 text-sm shadow-sm">
              <div className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">
                ගෙවීම් විස්තර / Payment Details / கட்டணம் செலுத்தும் விவரங்கள்
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-800 text-xs font-medium">
                <li>ගාස්තුව නියමිත දිනට පෙර ගෙවිය යුතුය.</li>
                <li>Payment should be made within the due date.</li>
                <li>கட்டணம் செலுத்த வேண்டிய கடைசி தேதி வரை செலுத்தவும்.</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 text-xs flex gap-3 items-center text-yellow-900 mt-2 shadow-sm">
              <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
              <div>
                <strong className="text-[11px]">කාලීනව ගෙවීම් කිරීම ඔබගේ ජල සැපයුම අඛණ්ඩව පවත්වා ගෙන යාමට උපකාරී වේ.</strong><br/>
                Timely payment helps to ensure uninterrupted water supply.<br/>
                <span className="text-[10px]">காலத்திற்கு உள்ளான கட்டணம் செலுத்துவது நீர் வழங்கலை தொடர்ச்சியாக உறுதி செய்கிறது.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end border-t-4 border-blue-600 pt-4 mt-2">
          <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-200 shadow-sm">
            <span className="text-4xl text-blue-500" role="img" aria-label="drop">💧</span>
            <div>
              <div className="font-bold text-blue-900">ජලය ජීවිතයේ මූලික අවශ්‍යතාවකි.</div>
              <div className="font-bold text-blue-800">Water is a vital resource for life.</div>
              <div className="font-bold text-blue-700 text-xs mt-0.5">நீர் வாழ்வின் அடிப்படைத் தேவையாகும்.</div>
            </div>
          </div>
          <div className="text-center w-56 flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-blue-800 rounded-full mb-1 flex items-center justify-center relative opacity-50 rotate-[-15deg]">
               <span className="text-[10px] font-bold text-blue-900 text-center uppercase">Galle<br/>Pradeshiya<br/>Sabha</span>
               <div className="absolute inset-0 border border-blue-800 rounded-full scale-90"></div>
            </div>
            <div className="border-b-2 border-blue-900 w-full pb-1 mb-1 relative mt-4">
               <span 
                 className="absolute bottom-1 left-1/2 text-blue-950 text-2xl opacity-90 whitespace-nowrap" 
                 style={{fontFamily: "'Brush Script MT', 'Lucida Handwriting', 'Segoe Print', cursive", transform: 'translateX(-50%) rotate(-5deg)'}}
               >
                 A.B. Perera
               </span>
            </div>
            <div className="text-xs font-bold text-blue-900">ජල සැපයුම් නිලධාරී</div>
            <div className="text-xs font-bold text-blue-800">Water Supply Officer</div>
            <div className="text-[10px] font-bold text-blue-700">நீர் வழங்கல் அதிகாரி</div>
          </div>
        </div>

      </div>
    </div>
  );
};
