"use client";

import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>


                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Mail className="h-8 w-8 mx-auto text-blue-500 mb-4" />
                            <h3 className="font-semibold mb-2">Email</h3>
                            <p className="text-muted-foreground text-sm">support@tablein.uz</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Phone className="h-8 w-8 mx-auto text-green-500 mb-4" />
                            <h3 className="font-semibold mb-2">Phone</h3>
                            <p className="text-muted-foreground text-sm">+998 (90) 123-45-67</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <MapPin className="h-8 w-8 mx-auto text-red-500 mb-4" />
                            <h3 className="font-semibold mb-2">Address</h3>
                            <p className="text-muted-foreground text-sm">
                                Amir Temur Avenue 107B, Yunusabad, Tashkent
                            </p>
                        </CardContent>
                    </Card>
                </div>

{/*
                 Contact Form
*/}
                {/*<Card className="mb-12">
                    <CardContent className="p-6 lg:p-8">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Send us a Message</h2>
                        <form className="grid gap-4">
                            <Input type="text" placeholder="Your Name" required />
                            <Input type="email" placeholder="Your Email" required />
                            <Textarea placeholder="Your Message" rows={5} required />
                            <Button className="bg-tablein-blue hover:bg-tablein-blue/90 w-full">
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>*/}

                 {/*Map*/}
                <Card>
                    <CardContent className="p-0">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.656!2d69.285!3d41.311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b123456789%3A0xabcdef!2sAmir%20Temur%20Ave%2C%20Tashkent!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
