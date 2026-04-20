import React, { useState, useRef, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { TopBar } from "../components/layout/TopBar";
import { Camera, Fingerprint, Gavel, Plus, Trash2, Printer, X, RefreshCw } from "lucide-react";

interface Person {
  id: string;
  name: string;
  age: string;
  address: string;
  aadhar: string;
  photo?: string;
  fingerprint?: string;
}

// Utility Component for Webcam Capture
function WebcamCapture({ onCapture, onClose }: { onCapture: (img: string) => void, onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Could not access camera. Please check permissions.");
        onClose();
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      onCapture(canvas.toDataURL('image/jpeg'));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm no-print">
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-outline-variant">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-label font-bold text-sm uppercase tracking-widest text-on-surface">Capture Photo</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="relative aspect-[3/4] bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
        </div>
        <div className="p-6 flex justify-center gap-4 bg-surface-container-low">
          <button 
            onClick={capture}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-label font-bold uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Camera size={20} />
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}

export function GiftDeedEditor() {
  const currentDate = new Date().toLocaleDateString('en-GB');

  const [persons, setPersons] = useState<Person[]>([
    { id: "1", name: "Richard Hendricks", age: "45", address: "1450 Page Mill Road, Palo Alto, CA", aadhar: "XXXX-XXXX-1234" }
  ]);

  const [activeCapture, setActiveCapture] = useState<{id: string, type: 'photo' | 'fingerprint'} | null>(null);

  const [declaration, setDeclaration] = useState({
    date: currentDate,
    purpose: "Gift Deed",
    pages: "01"
  });

  const [headerData, setHeaderData] = useState({
    serialNo: "",
    date: currentDate
  });

  const addPerson = () => {
    setPersons([...persons, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: "", 
      age: "", 
      address: "", 
      aadhar: "" 
    }]);
  };

  const removePerson = (id: string) => {
    if (persons.length > 1) {
      setPersons(persons.filter(p => p.id !== id));
    }
  };

  const updatePerson = (id: string, field: keyof Person, value: string) => {
    setPersons(persons.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleFileUpload = (id: string, type: 'photo' | 'fingerprint', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePerson(id, type, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="no-print">
        <TopBar />
      </div>

      {activeCapture?.type === 'photo' && (
        <WebcamCapture 
          onCapture={(img) => updatePerson(activeCapture.id, 'photo', img)} 
          onClose={() => setActiveCapture(null)} 
        />
      )}
      
      <main className="flex-1 overflow-y-auto p-0 md:p-8 flex flex-col items-center pb-24 bg-surface-container print:bg-white print:p-0">
        
        {/* Floating Print Action */}
        <div className="w-full max-w-4xl flex justify-end mb-6 no-print px-4 pt-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-body font-medium shadow-lg hover:opacity-90 transition-all"
          >
            <Printer size={20} />
            Print Document
          </button>
        </div>

        {/* Legal Document Container */}
        <article className="bg-surface-container-lowest w-full max-w-4xl paper-shadow rounded-none relative min-h-[1056px] flex flex-col border border-outline-variant/30 print:border-none print:shadow-none print:w-full print:max-w-none">
          
          <table className="w-full border-collapse">
            {/* Repeating Header in thead */}
            <thead className="display-table-header-group">
              <tr>
                <td>
                  <div className="p-8 md:p-12 border-b-2 border-surface-container flex flex-col gap-2 print:border-black print:pb-6">
                    <div className="flex flex-col items-center text-center">
                      <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface uppercase mb-1">Shri S. V. Tarte</h2>
                      <p className="font-headline text-xl font-medium text-primary uppercase tracking-widest mb-3 print:text-black">Advocate & Notary</p>
                      
                      <div className="w-full max-w-2xl border-t border-outline-variant/30 pt-3 flex flex-col gap-1">
                        <p className="font-label text-xs text-on-surface-variant leading-tight">
                          Address: C-2, Neville Plaza, Mominpura Road, Dombivil (E)-421201, Tal, Kalyan, Dist. Thane
                        </p>
                        <p className="font-label text-xs text-on-surface-variant font-medium">
                          Contact: Tel: 0251-2860358 / 421404, Mob: 94221 08667
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Space between header and content on subsequent pages */}
                  <div className="h-6 print:h-8"></div>
                </td>
              </tr>
            </thead>

            {/* Main Content in tbody */}
            <tbody>
              <tr>
                <td>
                  <div className="px-8 md:px-12 pb-12 flex flex-col gap-10">
                    {/* Main Document Content Area */}
                    <div className="flex flex-col gap-8">
                      {/* Sr. No & Date Row */}
                      <div className="flex flex-col md:flex-row justify-end items-end no-print">
                        <div className="text-right font-label text-sm text-on-surface-variant space-y-3 shrink-0">
                          <div className="flex items-center justify-end gap-2">
                            <span>Sr. No:</span>
                            <input 
                              type="text" 
                              value={headerData.serialNo}
                              onChange={(e) => setHeaderData({...headerData, serialNo: e.target.value})}
                              placeholder="NX-XXXX"
                              className="w-32 border-b border-outline-variant bg-transparent px-1 focus:outline-none focus:border-primary print:border-black" 
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span>Date:</span>
                            <input 
                              type="text" 
                              value={headerData.date}
                              onChange={(e) => setHeaderData({...headerData, date: e.target.value})}
                              className="w-32 border-b border-outline-variant bg-transparent px-1 focus:outline-none focus:border-primary print:border-black" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Signatories Rendering with Smart Grouping */}
                      <div className="space-y-16">
                        {/* Render all except the last person */}
                        {persons.slice(0, -1).map((person, index) => (
                          <section key={person.id} className="relative group p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 print:bg-transparent print:border-black print:p-0 print:border-none print:page-break-inside-avoid shadow-sm print:shadow-none transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6 no-print">
                               <div className="flex items-center gap-2">
                                  <span className="bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full">Signatory {index + 1}</span>
                               </div>
                              <button 
                                onClick={() => removePerson(person.id)}
                                className="p-2 text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:hidden"
                                disabled={persons.length === 1}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            {/* Narrative Sentence with Legal Justification */}
                            <div className="font-body text-lg text-on-surface leading-[2.2] mb-10 prose-legal">
                              I am 
                              <input 
                                className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-full max-w-[320px] print:border-black" 
                                type="text" 
                                value={person.name}
                                onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                                placeholder="[Full Name]"
                              />
                              Aged 
                              <input 
                                className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-16 text-center print:border-black" 
                                type="text" 
                                value={person.age}
                                onChange={(e) => updatePerson(person.id, 'age', e.target.value)}
                                placeholder="[Age]"
                              />
                              yrs. Residing at 
                              <textarea 
                                className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-full align-bottom resize-none h-auto min-h-[1.5em] overflow-hidden print:border-black"
                                value={person.address}
                                onChange={(e) => updatePerson(person.id, 'address', e.target.value)}
                                placeholder="[Full Address]"
                                rows={1}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                              />
                              Adhar Card No.: 
                              <input 
                                className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-56 text-center print:border-black" 
                                type="text" 
                                value={person.aadhar}
                                onChange={(e) => updatePerson(person.id, 'aadhar', e.target.value)}
                                placeholder="[Aadhar Number]"
                              />
                            </div>

                            {/* Verification Row - Styled for consistent printing */}
                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-surface-container-high print:border-black">
                              <div className="flex flex-col items-center">
                                <div className="w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-outline-variant rounded relative flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant/30 print:border-black print:border-solid print:bg-transparent overflow-hidden">
                                  {person.photo ? (
                                    <>
                                      <img src={person.photo} className="w-full h-full object-cover" alt="Captured Photo" />
                                      <button 
                                        onClick={() => setActiveCapture({ id: person.id, type: 'photo' })}
                                        className="no-print absolute bottom-2 right-2 p-1.5 bg-surface-container-lowest/80 rounded-lg hover:bg-white text-primary transition-colors"
                                      >
                                        <RefreshCw size={14} />
                                      </button>
                                    </>
                                  ) : (
                                    <button 
                                      onClick={() => setActiveCapture({ id: person.id, type: 'photo' })}
                                      className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors"
                                    >
                                      <Camera size={24} className="mb-2" />
                                      <span className="font-label text-[10px] uppercase font-bold tracking-widest text-center px-2">Capture Photo</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col justify-end items-center pb-4 min-h-[120px]">
                                <div className="w-full border-b border-on-surface/30 mb-3 print:border-black"></div>
                                <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Specimen Signature</p>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-outline-variant relative flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant/30 print:border-black print:border-solid print:bg-transparent overflow-hidden">
                                  {person.fingerprint ? (
                                    <>
                                      <img src={person.fingerprint} className="w-full h-full object-contain p-2" alt="Fingerprint" />
                                      <label className="no-print absolute bottom-2 right-2 p-1.5 bg-surface-container-lowest/80 rounded-lg hover:bg-white text-primary cursor-pointer transition-colors">
                                        <RefreshCw size={14} />
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(person.id, 'fingerprint', e)} />
                                      </label>
                                    </>
                                  ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-surface-container cursor-pointer transition-colors">
                                      <Fingerprint size={32} className="mb-2" />
                                      <span className="font-label text-[10px] uppercase font-bold tracking-widest text-center px-2 text-wrap">Upload Thumb</span>
                                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(person.id, 'fingerprint', e)} />
                                    </label>
                                  )}
                                </div>
                              </div>
                            </div>
                          </section>
                        ))}
                        
                        {/* Grouping the LAST signatory with the Declaration for print orphan prevention */}
                        <div className="print:page-break-inside-avoid space-y-16">
                          {persons.slice(-1).map((person, index) => (
                            <section key={person.id} className="relative group p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 print:bg-transparent print:border-black print:p-0 print:border-none print:page-break-inside-avoid shadow-sm print:shadow-none transition-all hover:shadow-md">
                              <div className="flex justify-between items-center mb-6 no-print">
                                 <div className="flex items-center gap-2">
                                    <span className="bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full">Signatory {persons.length}</span>
                                 </div>
                                <button 
                                  onClick={() => removePerson(person.id)}
                                  className="p-2 text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:hidden"
                                  disabled={persons.length === 1}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              
                              <div className="font-body text-lg text-on-surface leading-[2.2] mb-10 prose-legal">
                                I am 
                                <input 
                                  className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-full max-w-[320px] print:border-black" 
                                  type="text" 
                                  value={person.name}
                                  onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                                  placeholder="[Full Name]"
                                />
                                Aged 
                                <input 
                                  className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-16 text-center print:border-black" 
                                  type="text" 
                                  value={person.age}
                                  onChange={(e) => updatePerson(person.id, 'age', e.target.value)}
                                  placeholder="[Age]"
                                />
                                yrs. Residing at 
                                <textarea 
                                  className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-full align-bottom resize-none h-auto min-h-[1.5em] overflow-hidden print:border-black"
                                  value={person.address}
                                  onChange={(e) => updatePerson(person.id, 'address', e.target.value)}
                                  placeholder="[Full Address]"
                                  rows={1}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                  }}
                                />
                                Adhar Card No.: 
                                <input 
                                  className="bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none px-2 mx-1 font-bold text-on-surface w-56 text-center print:border-black" 
                                  type="text" 
                                  value={person.aadhar}
                                  onChange={(e) => updatePerson(person.id, 'aadhar', e.target.value)}
                                  placeholder="[Aadhar Number]"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-surface-container-high print:border-black">
                                <div className="flex flex-col items-center">
                                  <div className="w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-outline-variant rounded relative flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant/30 print:border-black print:border-solid print:bg-transparent overflow-hidden">
                                    {person.photo ? (
                                      <>
                                        <img src={person.photo} className="w-full h-full object-cover" alt="Captured Photo" />
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <Camera size={24} className="mb-2" />
                                        <span className="font-label text-[10px] uppercase font-bold tracking-widest text-center px-2">Affix Photo</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col justify-end items-center pb-4 min-h-[120px]">
                                  <div className="w-full border-b border-on-surface/30 mb-3 print:border-black"></div>
                                  <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Specimen Signature</p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-outline-variant relative flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant/30 print:border-black print:border-solid print:bg-transparent overflow-hidden">
                                    {person.fingerprint ? (
                                      <img src={person.fingerprint} className="w-full h-full object-contain p-2" alt="Fingerprint" />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <Fingerprint size={32} className="mb-2" />
                                        <span className="font-label text-[10px] uppercase font-bold tracking-widest text-center px-2 text-wrap">Left Thumb Impression</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>
                          ))}

                          {/* Declaration Section - Now grouped with the last signatory */}
                          <div className="mt-20 p-8 bg-surface-container-low rounded-2xl border border-outline-variant/30 print:bg-transparent print:p-0 print:border-t-0 print:border-black print:mt-12 group relative">
                            <div className="max-w-3xl mx-auto space-y-6 text-center">
                              <p className="font-body text-lg text-on-surface leading-loose prose-legal">
                                We have executed the annexed 
                                <input 
                                  type="text" 
                                  value={declaration.purpose}
                                  onChange={(e) => setDeclaration({...declaration, purpose: e.target.value})}
                                  className="font-bold border-b border-outline-variant bg-transparent px-2 mx-1 focus:outline-none focus:border-primary w-40 text-center print:border-black"
                                /> 
                                on 
                                <input 
                                  type="text" 
                                  value={declaration.date}
                                  onChange={(e) => setDeclaration({...declaration, date: e.target.value})}
                                  placeholder="[Insert Date]"
                                  className="font-bold border-b border-outline-variant bg-transparent px-2 mx-1 focus:outline-none focus:border-primary w-48 text-center print:border-black"
                                />.
                              </p>
                              <p className="font-body text-lg text-on-surface leading-loose prose-legal">
                                The above persons have signed and affixed their thumb impressions before me, and the said document contains 
                                <input 
                                  type="text" 
                                  value={declaration.pages}
                                  onChange={(e) => setDeclaration({...declaration, pages: e.target.value})}
                                  className="font-bold border-b border-outline-variant bg-transparent px-2 mx-1 focus:outline-none focus:border-primary w-12 text-center print:border-black"
                                /> 
                                pages.
                              </p>
                            </div>

                            <div className="flex justify-between items-end mt-16 print:mt-24">
                              <div className="w-48 h-48 border-2 border-dashed border-outline-variant rounded-full flex flex-col items-center justify-center text-center p-6 bg-surface-container-lowest print:border-black print:border-solid print:bg-transparent">
                                <Gavel size={32} className="text-outline-variant/50 mb-2 print:text-black" />
                                <span className="font-label text-xs text-on-surface-variant uppercase tracking-[.2em] font-bold">NOTARY PUBLIC STAMP</span>
                              </div>
                              
                              <div className="w-80 flex flex-col items-center text-center pb-4">
                                <div className="border-b-2 border-on-surface w-full mb-6 print:border-black"></div>
                                <p className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight">Signature of Notary</p>
                                <p className="font-label text-sm text-on-surface-variant font-medium mt-2">Official Seal and Authority</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </main>
    </Layout>
  );
}
