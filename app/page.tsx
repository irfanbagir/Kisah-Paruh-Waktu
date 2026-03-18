'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Heart, Phone, Briefcase, Clock, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type ArchetypeKey = 'P' | 'PR' | 'B' | 'Q' | 'U';
type ScoreMap = Record<ArchetypeKey, number>;

type Option = {
  label: string;
  scores: Partial<ScoreMap>;
};

type Question = {
  id: number;
  phase: 'The Present' | 'The Past' | 'The Future';
  text: string;
  options: Option[];
};

type Archetype = {
  code: ArchetypeKey;
  name: string;
  quote: string;
  mindset: string;
  bullets: string[];
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
};

const questions: Question[] = [
  {
    id: 1,
    phase: 'The Present',
    text: 'Akhir-akhir ini, cerita hidupmu terasa seperti bab apa?',
    options: [
      { label: 'Bab yang melelahkan, tapi terus berjalan', scores: { P: 2 } },
      { label: 'Bab yang masih mencari arah', scores: { U: 2 } },
      { label: 'Bab yang terasa biasa saja', scores: { B: 2 } },
    ],
  },
  {
    id: 2,
    phase: 'The Present',
    text: 'Di tengah kesibukanmu sekarang, seberapa sering kamu teringat Ayah?',
    options: [
      { label: 'Cukup sering', scores: { PR: 2 } },
      { label: 'Kadang-kadang', scores: { B: 2 } },
      { label: 'Jarang sekali', scores: { Q: 2 } },
    ],
  },
  {
    id: 3,
    phase: 'The Present',
    text: 'Kalau nama Ayah muncul di ponselmu sekarang...',
    options: [
      { label: 'Aku langsung angkat', scores: { P: 2, U: 1 } },
      { label: 'Aku telpon balik nanti', scores: { PR: 2 } },
      { label: 'Tidak aku angkat', scores: { Q: 2, U: 1 } },
    ],
  },
  {
    id: 4,
    phase: 'The Present',
    text: 'Kalau mengingat Ayah, potongan cerita apa yang paling sering muncul?',
    options: [
      { label: 'Dia selalu bekerja', scores: { PR: 2 } },
      { label: 'Dia selalu ada', scores: { P: 2 } },
      { label: 'Dia sering diam', scores: { Q: 2 } },
    ],
  },
  {
    id: 5,
    phase: 'The Present',
    text: 'Ada kalimat tentang Ayah yang belum pernah kamu ucapkan?',
    options: [
      { label: 'Terima kasih', scores: { PR: 2 } },
      { label: 'Maaf', scores: { U: 2 } },
      { label: 'Aku kangen', scores: { U: 2, PR: 1 } },
    ],
  },
  {
    id: 6,
    phase: 'The Past',
    text: 'Waktu kecil, momen seperti apa yang paling sering kamu ingat tentang Ayah?',
    options: [
      { label: 'Menunggu dia pulang', scores: { U: 2 } },
      { label: 'Melakukan sesuatu bersama', scores: { PR: 2 } },
      { label: 'Tidak banyak momen yang kuingat', scores: { Q: 2 } },
    ],
  },
  {
    id: 7,
    phase: 'The Past',
    text: 'Biasanya, kamu melihat Ayah di rumah dalam keadaan seperti apa?',
    options: [
      { label: 'Sibuk atau lelah', scores: { P: 2 } },
      { label: 'Santai dan hadir', scores: { PR: 2 } },
      { label: 'Lebih banyak diam', scores: { Q: 2 } },
    ],
  },
  {
    id: 8,
    phase: 'The Past',
    text: 'Waktu kecil, hal apa yang paling ingin kamu dapat dari Ayah?',
    options: [
      { label: 'Waktunya', scores: { PR: 2 } },
      { label: 'Perhatiannya', scores: { B: 2 } },
      { label: 'Pengertiannya', scores: { U: 2 } },
    ],
  },
  {
    id: 9,
    phase: 'The Past',
    text: 'Pernah ada momen kamu ingin dekat dengan Ayah, tapi tidak jadi?',
    options: [
      { label: 'Sering', scores: { U: 2 } },
      { label: 'Terkadang', scores: { B: 2 } },
      { label: 'Tidak pernah', scores: { PR: 2 } },
    ],
  },
  {
    id: 10,
    phase: 'The Past',
    text: 'Kalau bisa kembali ke satu momen kecil bersama Ayah, kamu ingin kembali ke momen seperti apa?',
    options: [
      { label: 'Momen sederhana bersama', scores: { PR: 2 } },
      { label: 'Momen saat dia benar-benar ada', scores: { U: 2 } },
      { label: 'Momen yang tidak sempat terjadi', scores: { U: 2, Q: 1 } },
    ],
  },
  {
    id: 11,
    phase: 'The Future',
    text: 'Jumat, 21:00. Ponselmu berbunyi. “Besok ada presentasi penting.” Besok anakmu pentas. Kamu sudah janji hadir.',
    options: [
      { label: 'Hadiri presentasi kerja', scores: { P: 2 } },
      { label: 'Hadiri pentas anak', scores: { PR: 2 } },
      { label: 'Cari cara agar bisa jalan dua-duanya', scores: { B: 2 } },
    ],
  },
  {
    id: 12,
    phase: 'The Future',
    text: 'Pengeluaran semakin banyak. Anak butuh biaya, orang tua juga mulai bergantung padamu. Tidak semuanya bisa terpenuhi.',
    options: [
      { label: 'Kebutuhan anak', scores: { PR: 2 } },
      { label: 'Kebutuhan orang tua', scores: { P: 2 } },
      { label: 'Berusaha membagi untuk semua', scores: { B: 2 } },
    ],
  },
  {
    id: 13,
    phase: 'The Future',
    text: 'Malam ini kamu masih bekerja. Pintu diketuk. “Ayah lagi sibuk?”',
    options: [
      { label: 'Untuk kamu selalu ada waktu, masuk nak', scores: { PR: 2 } },
      { label: 'Nanti ya nak, Ayah lagi kerja', scores: { P: 2 } },
      { label: 'Ada apa nak?', scores: { B: 2 } },
    ],
  },
  {
    id: 14,
    phase: 'The Future',
    text: 'Hari-hari terasa semakin padat. Kamu pulang dengan keadaan lelah. Anakmu ingin bercerita panjang.',
    options: [
      { label: 'Tetap mendengarkan, tetap tersenyum', scores: { PR: 2 } },
      { label: 'Minta cerita singkat saja', scores: { B: 2 } },
      { label: 'Menunda untuk lain waktu', scores: { P: 2 } },
    ],
  },
  {
    id: 15,
    phase: 'The Future',
    text: 'Waktu berjalan dan anakmu sudah tidak sering bercerita lagi. Suatu hari namanya muncul di ponselmu. Kamu teringat dulu sering tidak punya waktu.',
    options: [
      { label: 'Langsung angkat', scores: { PR: 2 } },
      { label: 'Diam sejenak sebelum menjawab', scores: { Q: 2 } },
      { label: 'Tidak diangkat', scores: { U: 2 } },
    ],
  },
];

const archetypes: Record<ArchetypeKey, Archetype> = {
  P: {
    code: 'P',
    name: 'The Present One',
    quote: 'Aku ingin benar-benar ada.',
    mindset: 'Waktu bersama adalah segalanya.',
    bullets: [
      'Pilih hadir di momen anak',
      'Responsif secara emosional',
      'Memprioritaskan kebersamaan',
      'Kadang mengorbankan stabilitas lain',
    ],
    summary: 'Kamu memilih untuk hadir di momen kecil yang mungkin akan diingat seumur hidup.',
    icon: Heart,
  },
  PR: {
    code: 'PR',
    name: 'The Provider',
    quote: 'Aku memastikan semuanya tetap berjalan.',
    mindset: 'Tanggung jawab adalah bentuk cinta.',
    bullets: [
      'Memilih kerja dan stabilitas',
      'Memprioritaskan kebutuhan finansial',
      'Sering mengorbankan waktu',
      'Hadir secara fisik, tapi tak selalu utuh',
    ],
    summary: 'Kamu memastikan semuanya tetap berjalan, walau kadang harus mengorbankan hadir.',
    icon: Briefcase,
  },
  B: {
    code: 'B',
    name: 'The Balancer',
    quote: 'Aku mencoba menjaga semuanya tetap utuh.',
    mindset: 'Semua penting. Aku harus bisa semuanya.',
    bullets: [
      'Sering memilih opsi tengah',
      'Tidak ingin mengecewakan siapa pun',
      'Hidup dalam kompromi',
      'Sering merasa tetap belum cukup',
    ],
    summary: 'Kamu terus mencoba menyeimbangkan semuanya, dan sering merasa itu tetap belum cukup.',
    icon: Clock,
  },
  Q: {
    code: 'Q',
    name: 'The Quiet Protector',
    quote: 'Aku tidak banyak bicara, tapi aku selalu ada.',
    mindset: 'Cinta tidak harus diucapkan.',
    bullets: [
      'Introvert dan cenderung diam',
      'Hadir tanpa banyak ekspresi',
      'Bertanggung jawab tanpa banyak komunikasi',
      'Sering sulit dipahami',
    ],
    summary: 'Kamu menjaga tanpa banyak kata. Tapi tidak semua orang tahu cara membacanya.',
    icon: Phone,
  },
  U: {
    code: 'U',
    name: 'The Unfinished Child',
    quote: 'Sebagian dari diriku masih anaknya.',
    mindset: 'Cara kita menjadi Ayah dipengaruhi cara kita dibesarkan.',
    bullets: [
      'Dipengaruhi pengalaman fase 1 dan 2',
      'Masih ada perasaan yang belum selesai',
      'Reflektif dan sensitif',
      'Membawa luka atau pertanyaan lama',
    ],
    summary: 'Sebagian dari dirimu masih mencoba memahami Ayahmu, dan itu ikut membentuk pilihanmu hari ini.',
    icon: Heart,
  },
};

const baseScores: ScoreMap = { P: 0, PR: 0, B: 0, Q: 0, U: 0 };

function mergeScores(answers: Array<Partial<ScoreMap> | undefined>): ScoreMap {
  return answers.reduce<ScoreMap>((acc, answer) => {
    if (!answer) return acc;
    Object.entries(answer).forEach(([key, value]) => {
      const typedKey = key as ArchetypeKey;
      acc[typedKey] += value ?? 0;
    });
    return acc;
  }, { ...baseScores });
}

function calculatePercentages(scores: ScoreMap): ScoreMap {
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0) || 1;
  return {
    P: Math.round((scores.P / total) * 100),
    PR: Math.round((scores.PR / total) * 100),
    B: Math.round((scores.B / total) * 100),
    Q: Math.round((scores.Q / total) * 100),
    U: Math.round((scores.U / total) * 100),
  };
}

function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  console.info(`[analytics] ${eventName}`, payload ?? {});
}

export default function Page() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<Partial<ScoreMap> | undefined>>([]);
  const [isSharing, setIsSharing] = useState(false);

  const currentQuestion = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  const scoreMap = useMemo(() => mergeScores(answers), [answers]);
  const percentages = useMemo(() => calculatePercentages(scoreMap), [scoreMap]);
  const ranking = useMemo(
    () => Object.entries(scoreMap).sort((a, b) => b[1] - a[1]) as Array<[ArchetypeKey, number]>,
    [scoreMap]
  );

  const dominantKey = ranking[0]?.[0] ?? 'PR';
  const dominant = archetypes[dominantKey];
  const topThree = ranking.slice(0, 3).map(([key]) => archetypes[key]);

  const handleStart = () => {
    trackEvent('microsite_started');
    setScreen('quiz');
  };

  const handleAnswer = (scores: Partial<ScoreMap>) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = scores;
    setAnswers(nextAnswers);

    trackEvent('question_answered', {
      questionId: currentQuestion.id,
      phase: currentQuestion.phase,
      answerIndex: index,
    });

    if (index < questions.length - 1) {
      setTimeout(() => setIndex((value) => value + 1), 160);
      return;
    }

    setTimeout(() => {
      trackEvent('result_viewed', { dominant: dominantKey });
      setScreen('result');
    }, 160);
  };

  const resetFlow = () => {
    trackEvent('quiz_reset');
    setScreen('intro');
    setIndex(0);
    setAnswers([]);
  };

  const handleShare = async () => {
    const shareText = `Hasil refleksiku di Kisah Paruh Waktu: ${dominant.name} — ${dominant.quote}`;
    const shareData = {
      title: 'Kisah Paruh Waktu',
      text: shareText,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      setIsSharing(true);
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareData.url}`);
      }
      trackEvent('result_shared', { dominant: dominant.code });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#20969E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,248,250,0.22),transparent_35%),radial-gradient(circle_at_bottom,rgba(170,124,44,0.18),transparent_30%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 md:px-8">
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Card className="overflow-hidden rounded-[2rem] border-[#82BCBF] bg-[#F6F8FA] shadow-2xl backdrop-blur">
                <div className="grid lg:grid-cols-2">
                  <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14">
                    <div className="space-y-6">
                      <Badge className="w-fit rounded-full bg-[#82BCBF]/40 px-4 py-1 text-[#211911] hover:bg-[#82BCBF]/40">
                        #KisahParuhWaktu
                      </Badge>

                                          </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      <Button
                        size="lg"
                        className="rounded-2xl bg-[#AA7C2C] px-6 text-white hover:bg-[#946a25]"
                        onClick={handleStart}
                      >
                        Mulai refleksi <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-2xl border-[#5BA5A7] bg-transparent text-[#211911] hover:bg-[#82BCBF]/20"
                      >
                        Lihat trailer
                      </Button>
                    </div>
                  </div>

                  <div className="border-l border-[#82BCBF] bg-gradient-to-br from-[#82BCBF]/35 via-[#20969E] to-[#5BA5A7]/45 p-8 md:p-12 lg:p-14 flex items-center justify-center">
  <p className="text-[#211911]/60 text-lg">
    (Space for illustration / visual)
  </p>
</div>
                </div>
              </Card>
            </motion.div>
          )}

          {screen === 'quiz' && currentQuestion && (
            <motion.div
              key={`quiz-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl"
            >
              <Card className="rounded-[2rem] border-[#82BCBF] bg-[#F6F8FA] shadow-2xl backdrop-blur">
                <CardHeader className="space-y-5 p-8 md:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-[#AA7C2C]">{currentQuestion.phase}</p>
                      <CardTitle className="mt-2 text-2xl text-[#211911] md:text-3xl">Question {currentQuestion.id}</CardTitle>
                    </div>
                    <Badge className="rounded-full bg-[#82BCBF]/45 px-4 py-1 text-[#211911] hover:bg-[#82BCBF]/45">
                      {index + 1}/{questions.length}
                    </Badge>
                  </div>

                  <Progress value={progress} className="h-2 bg-[#82BCBF]/50" />

                  <CardDescription className="text-lg leading-8 text-[#211911] md:text-xl">
                    {currentQuestion.text}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 p-8 pt-0 md:p-10 md:pt-0">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      whileTap={{ scale: 0.985 }}
                      key={option.label}
                      type="button"
                      onClick={() => handleAnswer(option.scores)}
                      className="w-full rounded-3xl border border-[#82BCBF] bg-white px-5 py-5 text-left text-base leading-7 text-[#211911] transition hover:border-[#5BA5A7] hover:bg-[#F6F8FA] focus:outline-none focus:ring-2 focus:ring-[#5BA5A7]/50"
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="rounded-[2rem] border-[#82BCBF] bg-[#F6F8FA] shadow-2xl backdrop-blur">
                  <CardHeader className="p-8 md:p-10">
                    <p className="text-sm uppercase tracking-[0.25em] text-[#AA7C2C]">Hasil Utama</p>
                    <CardTitle className="mt-2 text-3xl text-[#211911] md:text-5xl">{dominant.name}</CardTitle>
                    <CardDescription className="mt-3 text-lg text-[#417579]">“{dominant.quote}”</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 p-8 pt-0 md:p-10 md:pt-0">
                    <div className="rounded-3xl border border-[#82BCBF] bg-white/80 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-[#417579]">Mindset</p>
                      <p className="mt-2 text-xl text-[#211911]">{dominant.mindset}</p>
                      <p className="mt-4 text-[#417579]">{dominant.summary}</p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {dominant.bullets.map((bullet) => (
                        <div key={bullet} className="rounded-2xl border border-[#82BCBF] bg-white/90 p-4 text-[#211911]">
                          {bullet}
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-[#82BCBF]/50" />

                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="rounded-2xl bg-[#AA7C2C] px-6 text-white hover:bg-[#946a25]"
                        onClick={handleShare}
                        disabled={isSharing}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        {isSharing ? 'Membagikan...' : 'Bagikan hasil'}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl border-[#5BA5A7] bg-transparent text-[#211911] hover:bg-[#82BCBF]/20"
                        onClick={resetFlow}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Ulangi
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6">
                  <Card className="rounded-[2rem] border-[#82BCBF] bg-[#F6F8FA] shadow-2xl backdrop-blur">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-2xl text-[#211911]">Komposisi dirimu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-8 pt-0">
                      {ranking.map(([key]) => {
                        const item = archetypes[key];
                        const Icon = item.icon;
                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between gap-4 text-sm">
                              <div className="flex items-center gap-2 text-[#211911]">
                                <Icon className="h-4 w-4 text-[#AA7C2C]" />
                                <span>{item.name}</span>
                              </div>
                              <span className="text-[#417579]">{percentages[key]}%</span>
                            </div>
                            <Progress value={percentages[key]} className="h-2 bg-[#82BCBF]/50" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-[#82BCBF] bg-[#F6F8FA] shadow-2xl backdrop-blur">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-2xl text-[#211911]">Campuran terkuat</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 p-8 pt-0 md:grid-cols-3">
                      {topThree.map((item) => (
                        <div key={item.code} className="rounded-3xl border border-[#82BCBF] bg-white/90 p-5">
                          <p className="text-sm uppercase tracking-[0.2em] text-[#417579]">{item.code}</p>
                          <p className="mt-2 text-lg text-[#211911]">{item.name}</p>
                          <p className="mt-2 text-sm leading-6 text-[#417579]">{item.quote}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
