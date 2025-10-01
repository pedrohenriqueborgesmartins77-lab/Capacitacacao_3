import z, { TypeOf } from "zod";

export const getHolidaysSchema = z.object({
    params: z.object({
        ano: z.number(),
        estado: z.string(),

    })
})

export type HolidaysSchema = TypeOf<typeof getHolidaysSchema>

export interface HolidaysRouteInterface{
    Params: HolidaysSchema['params']
}