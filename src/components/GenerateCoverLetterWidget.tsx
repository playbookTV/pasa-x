import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from './Button';
import { TextInput } from './TextInput';

interface GenerateCoverLetterWidgetProps {
  onBack: () => void;
  onGenerate: () => void;
}

export const GenerateCoverLetterWidget: React.FC<GenerateCoverLetterWidgetProps> = ({
  onBack,
  onGenerate,
}) => {
  const keywords = [
    { name: 'Figma', matched: true },
    { name: 'Prototyping', matched: false },
    { name: 'UX Research', matched: true },
    { name: 'Web3', matched: false },
  ];

  return (
    <div className="w-80 h-96 p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden">
      <div className="grow shrink basis-0 px-3 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden">
        <div className="self-stretch justify-between items-center inline-flex">
          <button onClick={onBack} className="justify-center items-center gap-1 flex">
            <ArrowLeft className="w-4 h-6" />
            <div className="text-slate-900 text-sm font-semibold font-['Inter'] leading-tight">Back</div>
          </button>
          <div className="justify-end items-center gap-8 flex">
            <div className="justify-end items-center gap-5 flex">
              <div className="w-10 h-10 px-2 py-3 bg-slate-200 rounded-2xl flex-col justify-center items-center gap-2.5 inline-flex">
                <div className="text-slate-900 text-base font-semibold font-['Inter'] leading-7">CN</div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-96 p-4 bg-stone-100 rounded-lg flex-col justify-start items-center gap-6 flex overflow-hidden">
          <div className="self-stretch text-neutral-800 text-xl font-semibold font-['Inter']">Generate Coverletter</div>
          <div className="self-stretch h-96 flex-col justify-start items-start gap-6 flex">
            <div className="self-stretch h-44 flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Job title</div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="text-slate-900 text-sm font-bold font-['Inter'] leading-tight">Senior UX Designer</div>
                  <button className="text-indigo-600 text-sm font-semibold font-['Inter']">Edit</button>
                </div>
              </div>
              <div className="self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Company</div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="text-slate-900 text-sm font-bold font-['Inter'] leading-tight">Mozilla Firefox</div>
                  <button className="text-indigo-600 text-sm font-semibold font-['Inter']">Edit</button>
                </div>
              </div>
              <div className="self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Hiring manager (if known)</div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="text-slate-900 text-sm font-bold font-['Inter'] leading-tight">Unavailable</div>
                  <button className="text-indigo-600 text-sm font-semibold font-['Inter']">Edit</button>
                </div>
              </div>
            </div>
            <div className="self-stretch h-px border border-slate-200"></div>
            <div className="self-stretch h-96 flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-24 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Key Skills</div>
                <div className="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">
                  {keywords.map((keyword, index) => (
                    <div key={index} className={`p-2 bg-white rounded-2xl border border-neutral-200/90 justify-center items-center gap-1 flex overflow-hidden ${keyword.matched ? '' : 'opacity-30'}`}>
                      <div className="text-stone-950 text-sm font-medium font-['Inter']">{keyword.name}</div>
                      {keyword.matched && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="self-stretch h-52 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Relevant Experiences</div>
                <button className="text-indigo-600 text-sm font-semibold font-['Inter']">Pull from resume</button>
                <TextInput label="" placeholder="Experiences" className="w-full" />
              </div>
              <div className="self-stretch h-52 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Key Achievements</div>
                <button className="text-indigo-600 text-sm font-semibold font-['Inter']">Pull from resume</button>
                <TextInput label="" placeholder="Key achievement" className="w-full" />
              </div>
            </div>
            <div className="self-stretch h-px border border-slate-200"></div>
            <div className="self-stretch h-36 flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-16 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Template</div>
                <TextInput label="" placeholder="Skills" className="w-full" />
              </div>
              <div className="self-stretch h-16 flex-col justify-start items-start gap-1.5 flex">
                <div className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">Tone</div>
                <TextInput label="" placeholder="Skills" className="w-full" />
              </div>
            </div>
            <div className="self-stretch h-12 flex-col justify-start items-start gap-6 flex">
              <Button variant="primary" onClick={onGenerate} className="w-full">
                Generate Cover Letter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

