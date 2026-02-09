'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '@/components/layout/page-header';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { contactFormSchema, type ContactFormInput } from '@/lib/definitions';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('發送失敗');
      }

      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('發送失敗，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title="聯絡我們"
        description="如果您有任何建築設計需求或疑問，歡迎與我們聯繫。"
        breadcrumbs={[{ label: "聯絡我們" }]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info (Left Column) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">事務所資訊</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">地址</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    台北市大安區忠孝東路三段1號 (範例地址)<br />
                    Taipei City, Taiwan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">電話</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <a href="tel:+886-2-23456789" className="hover:text-orange-600 transition-colors">
                      (02) 2345-6789
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">電子郵件</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <a href="mailto:info@larry-architects.tw" className="hover:text-orange-600 transition-colors">
                      info@larry-architects.tw
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 h-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-400 text-sm">Google Maps 嵌入位置</p>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">發送訊息</h2>
            
            {submitStatus === 'success' ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-3">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">訊息已發送！</h3>
                <p className="text-green-600 dark:text-green-400 mb-4">
                  感謝您的聯繫，我們會盡快回覆您。
                </p>
                <button 
                  onClick={() => setSubmitStatus('idle')}
                  className="text-sm font-medium text-green-700 underline hover:text-green-800 dark:text-green-400"
                >
                  發送另一則訊息
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {submitStatus === 'error' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                    placeholder="您的稱呼"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      電子郵件 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      聯絡電話
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="選填"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    訊息內容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none ${
                        errors.message ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                    placeholder="請告訴我們您的需求..."
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      發送中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      送出訊息
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
