"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CreditCard, Globe, Shield } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { motion } from "framer-motion"

export function WelcomeStep() {
  const { nextStep } = useProgress()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <motion.div className="text-center space-y-2" variants={itemVariants}>
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative w-16 h-16 flex items-center justify-center rounded-full bg-primary/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="PayStell Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to PayStell</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Start accepting payments on the Stellar network in just a few minutes. Let's set up your merchant account.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Global Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Accept payments from customers worldwide on the Stellar network
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Enjoy minimal transaction fees compared to traditional payment processors
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Blockchain-powered security for all your payment transactions
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="flex flex-col md:flex-row gap-4 justify-center pt-4" variants={itemVariants}>
        <Button onClick={nextStep} size="lg" className="w-full md:w-auto group">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full md:w-auto"
          onClick={() => window.open("https://paystell.com/learn-more", "_blank")}
        >
          Learn More
        </Button>
      </motion.div>
    </motion.div>
  )
}

