import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employmentStatus: '',
    desiredPositions: [],
    age: '',
    name: '',
    kana: '',
    phone: '',
    email: '',
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobPositions = [
    { id: 'job_1', value: '法人営業', salary: '月給30万円以上＋インセンティブ（試用期間：最大6ヶ月）' },
    { id: 'job_2', value: 'SNS運用', salary: '月給23万円以上（試用期間：最大6ヶ月）' },
    { id: 'job_3', value: 'Webディレクター', salary: '年俸500万円以上（試用期間：最大6ヶ月）' },
    { id: 'job_4', value: 'Webデザイナー', salary: '年俸500万円以上（試用期間：最大6ヶ月）' },
    { id: 'job_5', value: 'Web広告運用者', salary: '年俸560万円以上（試用期間：最大6ヶ月）' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedPositions = checked
        ? [...formData.desiredPositions, value]
        : formData.desiredPositions.filter(pos => pos !== value);
      setFormData({ ...formData, desiredPositions: updatedPositions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.employmentStatus) newErrors.employmentStatus = '選択してください';
        break;
      case 2:
        if (formData.desiredPositions.length === 0) newErrors.desiredPositions = '1つ以上選択してください';
        break;
      case 3:
        if (!formData.age) newErrors.age = '入力してください';
        break;
      case 4:
        if (!formData.name.trim()) newErrors.name = '入力してください';
        if (!formData.kana.trim()) newErrors.kana = '入力してください';
        break;
      case 5:
        if (!formData.phone.trim()) newErrors.phone = '入力してください';
        if (!formData.email.trim()) newErrors.email = '入力してください';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        setIsConfirming(true);
      }
    }
  };

  const handlePrevious = () => {
    if (isConfirming) {
      setIsConfirming(false);
    } else {
      setStep(step - 1);
    }
    setErrors({});
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        // ここで実際のAPIエンドポイントを指定します
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('フォームが正常に送信されました。');
          // フォームをリセットするなどの処理をここに追加できます
        } else {
          throw new Error('送信に失敗しました');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('送信中にエラーが発生しました。しばらくしてからもう一度お試しください。');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-center">Q1</p>
            <p className="text-xl text-center">現在就業していますか？</p>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 border rounded hover:bg-gray-100 ${formData.employmentStatus === 'はい' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, employmentStatus: 'はい' });
                  setErrors({ ...errors, employmentStatus: '' });
                }}
              >
                はい
              </button>
              <button
                className={`px-4 py-2 border rounded hover:bg-gray-100 ${formData.employmentStatus === 'いいえ' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, employmentStatus: 'いいえ' });
                  setErrors({ ...errors, employmentStatus: '' });
                }}
              >
                いいえ
              </button>
            </div>
            {errors.employmentStatus && <p className="text-red-500 text-center">{errors.employmentStatus}</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-center">Q2</p>
            <p className="text-xl text-center">ご希望の職種をお選びください</p>
            <p className="text-sm text-center">（複数選択可）</p>
            <div className="space-y-2">
              {jobPositions.map((job) => (
                <div key={job.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={job.id}
                    name="desiredPositions"
                    value={job.value}
                    checked={formData.desiredPositions.includes(job.value)}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={job.id}>{job.value}</label>
                </div>
              ))}
            </div>
            {errors.desiredPositions && <p className="text-red-500">{errors.desiredPositions}</p>}
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <p className="font-bold mb-2">募集要項</p>
              <p className="text-sm mb-2">〒106-0047 東京都港区南麻布2-8-21 SNUG MINAMI-AZABU 1階、4階、5階</p>
              {jobPositions.map((job) => (
                <div key={job.id} className="mb-2">
                  <p className="font-semibold">{job.value}</p>
                  <p className="text-sm">{job.salary}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-center">Q3</p>
            <p className="text-xl text-center">年齢を入力してください</p>
            <div className="form-control">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-center">Q4</p>
            <p className="text-xl text-center">お名前とフリガナを教えてください</p>
            <div className="form-control">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="氏名"
              />
            </div>
            {errors.name && <p className="text-red-500">{errors.name}</p>}
            <div className="form-control">
              <input
                type="text"
                name="kana"
                value={formData.kana}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="フリガナ"
              />
            </div>
            {errors.kana && <p className="text-red-500">{errors.kana}</p>}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-center">Q5</p>
            <p className="text-xl text-center">ご連絡先を教えてください</p>
            <div className="form-control">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="電話番号"
              />
            </div>
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            <div className="form-control">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="メールアドレス"
              />
            </div>
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const renderConfirmation = () => (
    <div className="space-y-4 text-left">
      <h2 className="text-xl font-bold text-center mb-4">入力内容の確認</h2>
      <p className="text-center mb-4">ご入力内容に間違いがなければ、<br /><span className="font-bold">「送信する」</span>からエントリーしてください。</p>
      <div className="space-y-2">
        <p><span className="font-bold">Q1. 現在就業していますか？</span><br />{formData.employmentStatus}</p>
        <p><span className="font-bold">Q2. ご希望の職種</span><br />{formData.desiredPositions.join(', ')}</p>
        <p><span className="font-bold">Q3. 年齢</span><br />{formData.age}</p>
        <p><span className="font-bold">Q4. お名前とフリガナ</span><br />{formData.name} ({formData.kana})</p>
        <p><span className="font-bold">Q5. ご連絡先</span><br />電話番号: {formData.phone}<br />メールアドレス: {formData.email}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-6 text-center">
        <img src="/api/placeholder/100/100" alt="Logo" className="mx-auto" />
        <h1 className="text-2xl font-bold mt-4">応募フォーム</h1>
      </div>
      {!isConfirming && (
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="text-center flex-1">
              <div className={`w-full h-2 ${s <= step ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <p className={`text-xs mt-1 ${s === step ? 'font-bold' : ''}`}>
                Step {s}
              </p>
            </div>
          ))}
        </div>
      )}
      {isConfirming ? renderConfirmation() : renderStep()}
      <div className="mt-6 flex justify-between">
        {(step > 1 || isConfirming) && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            <ChevronLeft className="inline" /> 戻る
          </button>
        )}
        {!isConfirming ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            disabled={isSubmitting}
          >
            {step < 5 ? '次へ' : '確認'} <ChevronRight className="inline" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : '送信する'}
          </button>
        )}
      </div>
      <div className="mt-6 text-center text-sm text-red-500">
        新卒、中途、アルバイト募集中
      </div>
    </div>
  );
};

export default MultiStepForm;